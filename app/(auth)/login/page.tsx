'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

/**
 * Inner LoginForm component that reads query parameters.
 * Needs to be wrapped in a `<Suspense>` boundary to prevent Next.js static build bailouts.
 */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Retrieve 'redirect' parameter or fallback to '/dashboard'
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // Read if user was redirected after a successful registration
  const wasRegistered = searchParams.get('registered') === 'true';

  // Form State Hooks with explicit TypeScript types.
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [demoLoading, setDemoLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  /**
   * Action handler for standard email/password login.
   */
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || 'Invalid email or password.');
        setLoading(false);
        return;
      }

      router.push(redirectTo);
    } catch (err: any) {
      console.error('Login failed:', err);
      setError('Failed to connect to authentication server.');
      setLoading(false);
    }
  };

  /**
   * Action handler for Demo Login.
   * Checks if the demo account exists. If not, registers it transparently first,
   * then logs in (self-seeding).
   */
  const handleDemoLogin = async () => {
    setError('');
    setDemoLoading(true);

    const demoEmail = 'demo@internhive.com';
    const demoPassword = 'Demo1234Password!';
    const demoName = 'Demo Student';

    try {
      // 1. Attempt login with the demo account
      const { data, error: signInError } = await authClient.signIn.email({
        email: demoEmail,
        password: demoPassword,
      });

      if (signInError) {
        const errorMsg = signInError.message?.toLowerCase() || '';
        // If login fails because user does not exist or credentials incorrect, seed the user
        if (
          signInError.status === 401 ||
          errorMsg.includes('credential') ||
          errorMsg.includes('user') ||
          errorMsg.includes('not found')
        ) {
          console.log('Demo user not found. Seeding database with demo account...');
          
          // Register the demo user
          const { error: signUpError } = await authClient.signUp.email({
            email: demoEmail,
            password: demoPassword,
            name: demoName,
            // Set default initial values for skills/role if desired, they fallback automatically
          });

          if (signUpError) {
            setError(signUpError.message || 'Failed to auto-seed demo user.');
            setDemoLoading(false);
            return;
          }

          // Retry login after successful registration
          const { error: retryError } = await authClient.signIn.email({
            email: demoEmail,
            password: demoPassword,
          });

          if (retryError) {
            setError(retryError.message || 'Failed to log in after seeding demo account.');
            setDemoLoading(false);
            return;
          }

          router.push(redirectTo);
        } else {
          setError(signInError.message || 'An error occurred during demo login.');
          setDemoLoading(false);
        }
      } else {
        router.push(redirectTo);
      }
    } catch (err: any) {
      console.error('Demo login failed:', err);
      setError('Failed to execute demo login.');
      setDemoLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 shadow-[0px_4px_20px_rgba(20,33,61,0.05)] rounded-[24px] sm:px-10 border border-gray-100">
      <form className="space-y-6" onSubmit={handleLogin}>
        {wasRegistered && !error && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <p className="text-sm text-green-700 font-semibold">
              Registration successful! Please log in below.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-[#1B1B1E] mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-[#1B1B1E] mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
            placeholder="••••••••"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || demoLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-[#14213D] hover:bg-opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14213D] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-3 text-[#1B1B1E] opacity-50">Or proceed as</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Try Demo Login button using Amber #FCA311 outline */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={loading || demoLoading}
          className="w-full flex justify-center py-3 px-4 border-2 border-[#FCA311] rounded-xl text-sm font-semibold text-[#FCA311] bg-transparent hover:bg-[#FCA311] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FCA311] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {demoLoading ? 'Seeding/Logging in...' : 'Try Demo Login'}
        </button>

        <div className="text-center">
          <p className="text-sm text-[#1B1B1E] opacity-75">
            New to InternHive?{' '}
            <Link href="/register" className="font-semibold text-[#FCA311] hover:text-opacity-90">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Default Export wrapped in Suspense.
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F3F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-[#1B1B1E] opacity-80">
          Sign in to access your dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense
          fallback={
            <div className="bg-white py-8 px-6 shadow-[0px_4px_20px_rgba(20,33,61,0.05)] rounded-[24px] text-center border border-gray-100">
              <p className="text-sm text-gray-500">Loading form parameters...</p>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
