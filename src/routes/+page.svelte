<script lang="ts">
  import { api } from '$lib/api/client';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let user: { id: string; username: string } | null = null;

  onMount(async () => {
    try {
      user = await api.auth.me.get().then(r => r.data);
    } catch (e) {
      user = null;
    }
  });

  async function logout() {
    localStorage.removeItem('token');
    user = null;
    goto('/login');
  }
</script>

<div class="bg-white p-8 rounded-lg shadow">
  <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to SvelteKit + Elysia</h1>
  <p class="text-gray-600 text-lg">This is an example of type-safe authentication using Elysia backend.</p>
</div>
