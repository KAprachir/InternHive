import { createAuthClient } from 'better-auth/react';

/**
 * Better Auth Client Instance.
 * Exposes methods like `signUp.email()`, `signIn.email()`, and `useSession()`
 * to interact with auth endpoints on the client side.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});
