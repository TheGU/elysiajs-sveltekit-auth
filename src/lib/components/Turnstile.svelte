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
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad';
      script.async = true;
      script.defer = true;

      // Define global callback
      (window as any).onTurnstileLoad = () => {
        loaded = true;
        resolve();
      };
      
      script.addEventListener('error', () => {
        console.error('Failed to load Turnstile script');
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          setTimeout(() => loadTurnstile(), 1000 * retryCount);
        }
      });
      
      document.head.appendChild(script);
    });
  }

  function initTurnstile() {
    if (!browser || !loaded || !widget || !window.turnstile) return;

    try {
      // Render widget
      widgetId = window.turnstile.render(widget, {
        sitekey: PUBLIC_TURNSTILE_SITE_KEY,
        callback: (token: string) => {
          onVerify(token);
        },
        'error-callback': () => {
          // Reset on error
          if (widgetId) {
            window.turnstile?.reset(widgetId);
          }
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
      // Retry initialization
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
