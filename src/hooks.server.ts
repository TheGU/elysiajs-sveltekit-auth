import type { Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';

export const handle: Handle = i18n.handle();
