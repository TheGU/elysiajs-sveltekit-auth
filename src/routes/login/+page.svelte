<script lang="ts">
  import { api } from '$lib/api/client';
  import { goto } from '$app/navigation';
  import { updateUser } from '$lib/stores/auth';
  import Turnstile from '$lib/components/Turnstile.svelte';
  import Spinner from '$lib/components/Spinner.svelte';

  let username = '';
  let password = '';
  let error = '';
  let turnstileToken = '';
  let loading = false;

  async function handleSubmit() {
    if (!turnstileToken) {
      error = 'Please complete the captcha';
      return;
    }

    loading = true;
    error = '';

    try {
      const { data, error: resError } = await api.auth.login.post({ 
        username, 
        password,
        cfToken: turnstileToken
      });
      
      if (resError) error = resError || 'Login failed';
      else {
        localStorage.setItem('token', data.token);
        updateUser(data.user);
        goto('/');
      }
    } catch (e) {
      error = 'Login failed';
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
  <h1 class="text-3xl font-bold text-gray-900 mb-6">Login</h1>
  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Username
        <input 
          bind:value={username}
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </label>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Password
        <input 
          type="password"
          bind:value={password}
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </label>
    </div>
    {#if error}
      <p class="text-red-500 text-sm">{error}</p>
    {/if}
    <div class="my-4">
      <Turnstile onVerify={(token) => turnstileToken = token} />
    </div>
    <button 
      type="submit"
      disabled={loading}
      class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {#if loading}
        <Spinner />
        <span class="ml-2">Logging in...</span>
      {:else}
        Login
      {/if}
    </button>
  </form>
  <p class="mt-4 text-center text-sm text-gray-600">
    <a href="/register" class="text-blue-500 hover:text-blue-600">Need an account? Register</a>
  </p>
</div>
