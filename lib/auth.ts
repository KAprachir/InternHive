import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';
import { client } from './mongoClient';

/**
 * Better Auth Server Configuration.
 * Uses the native MongoDB adapter to store user credentials, sessions, and accounts.
 * Includes additional custom fields for `skills` and `role` to match student user profiles.
 */
export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  trustedProxyHeaders: true,
  trustedOrigins: [
    'http://localhost:3000',
    'https://internhive.vercel.app',
    'https://*.vercel.app',
  ],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      skills: {
        type: 'string[]',
        required: false,
        defaultValue: [],
      },
      role: {
        type: 'string',
        required: false,
        defaultValue: 'student',
      },
    },
  },
  plugins: [nextCookies()],
});
export type Auth = typeof auth;
