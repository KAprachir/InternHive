'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { Internship } from '@/components/InternshipCard';

/**
 * ManagePage Component.
 * Table of internships posted by the currently authenticated user.
 * Supports View details and Delete actions.
 */
export default function ManageInternshipsPage() {
  const router = useRouter();

  // Better Auth React hook to retrieve session state
  const { data: session, isPending: sessionPending } = authClient.useSession();

  // Component states with explicit TypeScript types
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null); // Track ID of row currently deleting

  // Protect route client-side: redirect to login if session fails
  useEffect(() => {
    if (!sessionPending && !session) {
      router.push('/login?redirect=/internships/manage');
    }
  }, [session, sessionPending, router]);

  // Fetch postings created by current user
  useEffect(() => {
    if (!session) return;

    const fetchMyInternships = async () => {
      setLoading(true);
      setError('');
      try {
        // Query API filtering by the current user ID
        const res = await fetch(`/api/internships?postedBy=${session.user.id}`);
        if (!res.ok) {
          throw new Error('Failed to retrieve listings.');
        }

        const resData = await res.json();
        if (resData.success && resData.data && Array.isArray(resData.data.internships)) {
          setInternships(resData.data.internships);
        } else {
          setError(resData.message || 'An error occurred loading listings.');
        }
      } catch (err: any) {
        console.error('Fetch manage listings error:', err);
        setError(err.message || 'Failed to connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyInternships();
  }, [session]);

  /**
   * Action handler for deleting an internship listing.
   * Calls DELETE /api/internships/[id].
   */
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this internship listing? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(id);
    setError('');

    try {
      const res = await fetch(`/api/internships/${id}`, {
        method: 'DELETE',
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Failed to delete listing.');
      }

      if (resData.success) {
        // Remove listing from state directly
        setInternships((prev) => prev.filter((item) => (item.id || item._id) !== id));
      } else {
        setError(resData.message || 'Failed to complete deletion.');
      }
    } catch (err: any) {
      console.error('Delete internship error:', err);
      setError(err.message || 'Failed to delete internship listing.');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (sessionPending || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex-1 flex justify-center items-center">
        <p className="text-sm text-gray-500 animate-pulse font-medium">Loading your listings...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col space-y-8">
      {/* Header with CTA Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
            Manage Posted Internships
          </h2>
          <p className="mt-2 text-sm text-[#1B1B1E] opacity-75">
            Review, inspect, or delete internship opportunities you have listed on the platform
          </p>
        </div>
        <Link
          href="/internships/add"
          className="px-5 py-3 bg-[#FCA311] hover:bg-opacity-95 text-white font-semibold text-sm rounded-xl transition duration-200 shadow-md cursor-pointer"
        >
          Post New Internship
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm text-center">
          {error}
        </div>
      )}

      {internships.length === 0 ? (
        // Empty State
        <div className="bg-white rounded-[24px] py-20 text-center shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100 flex flex-col items-center justify-center">
          <svg className="h-14 w-14 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
            No Opportunities Posted
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mt-2 mb-6">
            You haven't listed any internship opportunities yet. Create one now to begin matching with Bangladeshi student talents.
          </p>
          <Link
            href="/internships/add"
            className="px-6 py-3 bg-[#14213D] text-white font-semibold text-sm rounded-xl hover:bg-opacity-95 transition duration-200 shadow-md"
          >
            List an Internship
          </Link>
        </div>
      ) : (
        /* Postings Data Table */
        <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50 flex flex-col">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-left text-xs">
              <thead>
                <tr className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Opportunity</th>
                  <th className="py-3 px-4">Workspace</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Stipend</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[#1B1B1E] opacity-90 font-medium">
                {internships.map((item) => {
                  const id = item.id || item._id;
                  if (!id) return null;

                  return (
                    <tr key={id} className="hover:bg-[#F5F3F6]/20 transition duration-150">
                      <td className="py-4 px-4">
                        <span className="block font-bold text-[#14213D]">{item.title}</span>
                        <span className="block text-[10px] text-gray-400 mt-0.5">{item.company}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#14213D]/5 text-[#14213D]">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-500">{item.location}</td>
                      <td className="py-4 px-4 text-gray-400">
                        {item.stipend !== undefined && item.stipend > 0
                          ? `৳ ${item.stipend.toLocaleString()}`
                          : 'Negotiable'}
                      </td>
                      <td className="py-4 px-4 text-right space-x-3">
                        <Link
                          href={`/internships/${id}`}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-[10px] font-semibold text-[#14213D] hover:bg-gray-50 transition duration-200"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(id)}
                          disabled={deleteLoading === id}
                          className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-[10px] font-semibold text-red-600 hover:bg-red-100 transition duration-200 disabled:opacity-50 cursor-pointer"
                        >
                          {deleteLoading === id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
