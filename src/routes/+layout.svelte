<script lang="ts">
  import { i18n } from '$lib/i18n';
  import { ParaglideJS } from '@inlang/paraglide-sveltekit';
  import { api } from '$lib/api/client';
  import { onMount } from 'svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import { updateUser } from '$lib/stores/auth';
  import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

  import '../app.css';

  let { children } = $props();

  injectSpeedInsights();
  onMount(async () => {
    try {
      const userData = await api.auth.me.get().then(r => r.data);
      updateUser(userData);
    } catch (e) {
      updateUser(null);
    }
  });
</script>

<div class="min-h-screen bg-gray-100">
  <Navbar />
  <main class="container mx-auto px-4 py-8">
    <ParaglideJS {i18n}>
      {@render children()}
    </ParaglideJS>
  </main>
</div>
