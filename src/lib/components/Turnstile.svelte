<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { PUBLIC_TURNSTILE_SITE_KEY, PUBLIC_API_URL } from '$env/static/public';

  export let onVerify: (token: string) => void;
  
  let loaded = browser && 'turnstile' in window;
  let mounted = false;
  let widget: HTMLDivElement;
  let widgetId: number | null = null;
  let retryCount = 0;
  const MAX_RETRIES = 3;
  
  function loadTurnstile(): Promise<void> {
    return new Promise((resolve) => {
      if (loaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      // Remove render=explicit to let Turnstile handle its own resource loading
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      
      // Add proper resource hints
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://challenges.cloudflare.com';
      document.head.appendChild(preconnect);

      script.onload = () => {
        loaded = true;
        resolve();
      };
      
      script.onerror = () => {
        console.error('Failed to load Turnstile script');
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          setTimeout(() => loadTurnstile(), 1000 * retryCount);
        }
      };
      
      document.head.appendChild(script);
    });
  }

  function initTurnstile() {
    if (!browser || !loaded || !widget || !window.turnstile) return;

    try {
      // Reset existing widget if any
      if (widgetId) {
        window.turnstile.remove(widgetId);
      }

      // Render widget
      widgetId = window.turnstile.render(widget, {
        sitekey: PUBLIC_TURNSTILE_SITE_KEY,
        callback: onVerify,
        'error-callback': () => {
          console.log('Turnstile encountered an error');
          if (widgetId) window.turnstile?.reset(widgetId);
        },
        'expired-callback': () => {
          console.log('Turnstile expired');
          if (widgetId) window.turnstile?.reset(widgetId);
        },
        'refresh-expired': 'auto',
        theme: 'light',
        size: 'normal',
        appearance: 'always',
        retry: 'auto',
        'retry-interval': 1000,
        domain: new URL(PUBLIC_API_URL).hostname
      });
    } catch (e) {
      console.error('Failed to initialize Turnstile:', e);
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        setTimeout(initTurnstile, 1000 * retryCount);
      }
    }
  }
  
  onMount(async () => {
    if (!browser) return;
    
    mounted = true;
    try {
      await loadTurnstile();
      // Small delay to ensure turnstile is fully initialized
      setTimeout(initTurnstile, 500);
    } catch (e) {
      console.error('Error mounting Turnstile:', e);
    }
  });

  onDestroy(() => {
    if (browser && widgetId && window.turnstile) {
      try {
        window.turnstile.remove(widgetId);
      } catch (e) {
        console.error('Error removing Turnstile:', e);
      }
    }
  });
</script>

<svelte:head>
  {#if browser}
    <link rel="dns-prefetch" href="https://challenges.cloudflare.com">
  {/if}
</svelte:head>

{#if loaded && mounted}
  <div bind:this={widget} class="turnstile-widget"></div>
{:else}
  <div class="turnstile-widget">
    <div class="loading">Loading captcha...</div>
  </div>
{/if}

<style>
  .turnstile-widget {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
    min-height: 65px;
  }
  .loading {
    color: #666;
    font-size: 0.875rem;
  }
</style>
