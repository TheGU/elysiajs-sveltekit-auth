import { writable } from 'svelte/store';

type User = { id: string; username: string } | null;

export const user = writable<User>(null);

export function updateUser(userData: User) {
    user.set(userData);
}
