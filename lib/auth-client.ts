import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import type { Auth } from './auth';

/**
 * Better Auth Client Instance.
 * Exposes methods like `signUp.email()`, `signIn.email()`, and `useSession()`
 * to interact with auth endpoints on the client side.
 */
export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<Auth>()],
});
