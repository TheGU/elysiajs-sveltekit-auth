<script lang="ts">
  import { goto } from '$app/navigation';
  import { user, updateUser } from '$lib/stores/auth';

  async function logout() {
    localStorage.removeItem('token');
    updateUser(null);
    await goto('/login');
  }
</script>

<nav class="bg-white p-4 shadow mb-8">
  <div class="container mx-auto flex items-center justify-between">
    <a href="/" class="text-xl font-bold text-gray-800">Elysia + SvelteKit</a>
    <div>
      {#if $user}
        <div class="flex items-center gap-4">
          <a 
            href="/profile"
            class="text-blue-600 hover:text-blue-900"
          >
            Profile
          </a> /
          <p class="text-gray-600">Welcome, <span class="font-semibold">{$user.username}</span>!</p>
          <button 
            on:click={logout}
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      {:else}
        <div class="space-x-4">
          <a 
            href="/login"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Login
          </a>
          <a 
            href="/register"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Register
          </a>
        </div>
      {/if}
    </div>
  </div>
</nav>
