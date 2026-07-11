'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

/**
 * Navbar Component.
 * Sticky navigation header at the top of every page.
 * Uses Better Auth react hook `useSession()` to check user log-in state.
 */
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Mobile menu open state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Better Auth React hook to retrieve session state
  const { data: session, isPending } = authClient.useSession();

  /**
   * Action handler for user logout.
   */
  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  /**
   * Helper function to check if a navigation link is active.
   * Renders the active styling (Amber underline or text color shift).
   */
  const isActive = (path: string): boolean => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const linkStyle = (path: string): string => {
    return `text-sm font-semibold transition-all duration-200 py-2 relative ${
      isActive(path)
        ? 'text-[#FCA311]' // Amber text when active
        : 'text-white hover:text-[#FCA311]' // Hover effect
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#14213D] shadow-md border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand/Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold tracking-tight text-white font-[family-name:var(--font-space-grotesk)]">
                Intern<span className="text-[#FCA311]">Hive</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={linkStyle('/')}>
              Home
              {isActive('/') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FCA311] rounded-full" />
              )}
            </Link>
            <Link href="/internships" className={linkStyle('/internships')}>
              Internships
              {isActive('/internships') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FCA311] rounded-full" />
              )}
            </Link>

            {/* Conditionally render routes based on authentication state */}
            {!isPending && session ? (
              <>
                <Link href="/dashboard" className={linkStyle('/dashboard')}>
                  Dashboard
                  {isActive('/dashboard') && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FCA311] rounded-full" />
                  )}
                </Link>
                <Link href="/internships/add" className={linkStyle('/internships/add')}>
                  Add Internship
                  {isActive('/internships/add') && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FCA311] rounded-full" />
                  )}
                </Link>
                <Link href="/internships/manage" className={linkStyle('/internships/manage')}>
                  Manage
                  {isActive('/internships/manage') && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FCA311] rounded-full" />
                  )}
                </Link>
                
                {/* User Info & Logout Button */}
                <div className="flex items-center space-x-4 pl-4 border-l border-gray-700">
                  <span className="text-sm font-medium text-white max-w-[120px] truncate">
                    Hi, {session.user.name.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-[#FCA311] text-[#FCA311] text-xs font-semibold rounded-lg hover:bg-[#FCA311] hover:text-white transition duration-200 cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/about" className={linkStyle('/about')}>
                  About
                  {isActive('/about') && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FCA311] rounded-full" />
                  )}
                </Link>
                <Link href="/contact" className={linkStyle('/contact')}>
                  Contact
                  {isActive('/contact') && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FCA311] rounded-full" />
                  )}
                </Link>

                <div className="flex items-center pl-4 border-l border-gray-700">
                  <Link
                    href="/login"
                    className="px-4 py-2 border border-[#FCA311] bg-[#FCA311] text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 transition duration-200"
                  >
                    Log In
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-[#FCA311] hover:bg-navy-800 focus:outline-none transition duration-200 cursor-pointer"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#14213D] border-t border-gray-800">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') ? 'text-[#FCA311] bg-navy-800' : 'text-white hover:text-[#FCA311]'
              }`}
            >
              Home
            </Link>
            <Link
              href="/internships"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/internships') ? 'text-[#FCA311] bg-navy-800' : 'text-white hover:text-[#FCA311]'
              }`}
            >
              Internships
            </Link>

            {!isPending && session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/dashboard') ? 'text-[#FCA311] bg-navy-800' : 'text-white hover:text-[#FCA311]'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/internships/add"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/internships/add') ? 'text-[#FCA311] bg-navy-800' : 'text-white hover:text-[#FCA311]'
                  }`}
                >
                  Add Internship
                </Link>
                <Link
                  href="/internships/manage"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/internships/manage') ? 'text-[#FCA311] bg-navy-800' : 'text-white hover:text-[#FCA311]'
                  }`}
                >
                  Manage
                </Link>
                <div className="pt-4 pb-2 border-t border-gray-800 mt-4 px-3 flex flex-col space-y-3">
                  <span className="text-sm font-medium text-white">
                    Logged in as: <span className="text-[#FCA311]">{session.user.name}</span>
                  </span>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-center py-2 border border-[#FCA311] text-[#FCA311] text-sm font-semibold rounded-lg hover:bg-[#FCA311] hover:text-white transition duration-200 cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/about') ? 'text-[#FCA311] bg-navy-800' : 'text-white hover:text-[#FCA311]'
                  }`}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/contact') ? 'text-[#FCA311] bg-navy-800' : 'text-white hover:text-[#FCA311]'
                  }`}
                >
                  Contact
                </Link>
                <div className="pt-4 border-t border-gray-800 mt-4 px-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 bg-[#FCA311] text-white text-sm font-semibold rounded-lg hover:bg-opacity-90 transition duration-200"
                  >
                    Log In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
