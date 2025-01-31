<script lang="ts">
  import { api } from '$lib/api/client';
  import { goto } from '$app/navigation';
  import { updateUser } from '$lib/stores/auth';
  import Turnstile from '$lib/components/Turnstile.svelte';
  import Spinner from '$lib/components/Spinner.svelte';

  let username = '';
  let password = '';
  let confirmPassword = '';
  let error = '';
  let turnstileToken = '';
  let loading = false;

  async function handleSubmit() {
    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    if (!turnstileToken) {
      error = 'Please complete the captcha';
      return;
    }

    loading = true;
    error = '';

    try {
      const response = await api.auth.register.post({ 
        username, 
        password,
        cfToken: turnstileToken
      });
      localStorage.setItem('token', response.data.token);
      updateUser(response.data.user);
      goto('/');
    } catch (e: any) {
      error = e.response?.data?.message || 'Registration failed';
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
  <h1 class="text-3xl font-bold text-gray-900 mb-6">Register</h1>
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
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Confirm Password
        <input 
          type="password"
          bind:value={confirmPassword}
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </label>
    </div>
    <div class="my-4">
      <Turnstile onVerify={(token) => turnstileToken = token} />
    </div>
    {#if error}
      <p class="text-red-500 text-sm">{error}</p>
    {/if}
    <button 
      type="submit"
      disabled={loading}
      class="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {#if loading}
        <Spinner />
        <span class="ml-2">Registering...</span>
      {:else}
        Register
      {/if}
    </button>
  </form>
  <p class="mt-4 text-center text-sm text-gray-600">
    <a href="/login" class="text-blue-500 hover:text-blue-600">Already have an account? Login</a>
  </p>
</div>
