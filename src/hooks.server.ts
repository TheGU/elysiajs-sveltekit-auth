import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { i18n } from '$lib/i18n';

const handleParaglide: Handle = i18n.handle();
const handleSwaggerWorkAround: Handle = async ({ event, resolve }) => {
	// TODO: Workaround for the Swagger UI wrongly openapi path not respect prefix
	// "@elysiajs/swagger": "^1.2.0"
	if (event.url.pathname.startsWith('/swagger/json')) {
		return new Response(null, { status: 303, headers: { location: '/api/swagger/json' } });
	}
	return resolve(event);
};

export const handle: Handle = sequence(handleSwaggerWorkAround, handleParaglide);