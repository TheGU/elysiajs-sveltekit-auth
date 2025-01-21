<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';

  export let onVerify: (token: string) => void;
  
  let loaded = browser && 'turnstile' in window;
  let mounted = false;
  let widget: HTMLDivElement;
  let widgetId: number | null = null;
  
  function loadTurnstile(): Promise<void> {
    return new Promise((resolve) => {
      if (loaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.addEventListener('load', () => {
        loaded = true;
        resolve();
      }, { once: true });
      
      document.head.appendChild(script);
    });
  }

  function initTurnstile() {
    if (!browser || !loaded || !widget || !window.turnstile) return;

    // Render widget
    widgetId = window.turnstile.render(widget, {
      sitekey: PUBLIC_TURNSTILE_SITE_KEY,
      callback: (token: string) => {
        onVerify(token);
      },
      'refresh-expired': 'auto',
      theme: 'light',
      size: 'normal'
    });
  }
  
  onMount(async () => {
    if (!browser) return;
    
    mounted = true;
    await loadTurnstile();
    
    // Small delay to ensure turnstile is fully initialized
    setTimeout(initTurnstile, 100);
  });

  onDestroy(() => {
    if (browser && widgetId && window.turnstile) {
      window.turnstile.remove(widgetId);
    }
  });
</script>

{#if loaded && mounted}
  <div bind:this={widget} class="turnstile-widget"></div>
{/if}

<style>
  .turnstile-widget {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
  }
</style>
