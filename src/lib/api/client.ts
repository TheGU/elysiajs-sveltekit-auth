import { treaty } from '@elysiajs/eden';
import type { App } from '@/routes/api/[...slugs]/+server';
import { PUBLIC_API_URL } from '$env/static/public';

export const backend = treaty<App>(`${PUBLIC_API_URL}`, {
    headers: () => {
        const token = localStorage.getItem('token') || '';
        return { authorization: `Bearer ${token}`};
    }
});
export const api = backend.api;