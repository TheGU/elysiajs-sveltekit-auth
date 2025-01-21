<script lang="ts">
  import { api } from '$lib/api/client';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let user: { id: string; username: string } | null = null;
  let error: string | null = null;
  let loading = true;

  onMount(async () => {
    try {
      user = await api.auth.me.get().then(r => r.data);
    } catch (e: any) {
      error = e.response?.data?.message || 'Access Denied';
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <div class="text-center">
    <p class="text-gray-600">Loading...</p>
  </div>
{:else if error}
  <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p class="text-gray-600 mb-4">{error}</p>
      <a 
        href="/login" 
        class="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Go to Login
      </a>
    </div>
  </div>
{:else if user}
  <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
    <div class="space-y-4">
      <div>
        <h2 class="text-sm font-medium text-gray-500">Username</h2>
        <p class="text-lg text-gray-900">{user.username}</p>
      </div>
      <div>
        <h2 class="text-sm font-medium text-gray-500">User ID</h2>
        <p class="text-lg text-gray-900">{user.id}</p>
      </div>
    </div>
  </div>
{/if}
