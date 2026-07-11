import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

// Catch-all API handler for Better Auth server operations.
// Exposes GET and POST methods for login, registration, sessions, accounts etc.
export const { POST, GET } = toNextJsHandler(auth);
