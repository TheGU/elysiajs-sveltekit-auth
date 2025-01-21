import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { PUBLIC_API_PATH } from '$env/static/public';
import { authRouter } from '$lib/server/auth';

const app = new Elysia({ prefix: PUBLIC_API_PATH })
	.onError(({ code, error }) => {
		console.error(`Error ${code}:`, error);
		return new Response(
			JSON.stringify({
				error: error,
				code
			}),
			{
				status: code === 'NOT_FOUND' ? 404 : 500
			}
		);
	})
	.use(
		await swagger({
			documentation: {
				components: {
					securitySchemes: {
						bearerAuth: {
							type: 'http',
							scheme: 'bearer',
							bearerFormat: 'JWT'
						}
					}
				}
			}
		})
	)
	.use(authRouter)
	.get('/hi', () => 'Hi Elysia');

export type App = typeof app;

type RequestHandler = (v: { request: Request }) => Response | Promise<Response>;

export const GET: RequestHandler = ({ request }) => app.handle(request);
export const POST: RequestHandler = ({ request }) => app.handle(request);
