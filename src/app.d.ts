// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
		}
	}

	interface Window {
		turnstile?: {
			render: (
				element: HTMLElement,
				options: {
					sitekey: string;
					callback?: (token: string) => void;
					 'error-callback'?: () => void;
					'refresh-expired'?: 'auto' | 'manual' | 'never';
					theme?: 'light' | 'dark' | 'auto';
					size?: 'normal' | 'compact' | 'invisible';
					appearance?: 'always' | 'execute' | 'interaction-only';
					retry?: 'auto' | 'never';
					'retry-interval'?: number;
					domain?: string;
				}
			) => number;
			remove: (widgetId: number) => void;
			reset: (widgetId: number) => void;
		};
		onTurnstileLoad?: () => void;
	}
}

export {};
