'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InternshipCard, { Internship } from '@/components/InternshipCard';

/**
 * SkeletonCard Component.
 * Displayed as a loading placeholder representing an InternshipCard.
 * Applies Pulse animation, identical size, and rounded borders matching DESIGN.md.
 */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(20,33,61,0.05)] border border-gray-100/50 animate-pulse flex flex-col justify-between h-[300px]">
      <div>
        <div className="flex justify-between items-start">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
        </div>
        <div className="h-5 w-3/4 bg-gray-200 rounded mt-4" />
        <div className="flex space-x-4 mt-3">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-12 bg-gray-200 rounded-full" />
        </div>
        <div className="space-y-2 mt-6">
          <div className="h-3 w-full bg-gray-200 rounded" />
          <div className="h-3 w-5/6 bg-gray-200 rounded" />
        </div>
        <div className="flex space-x-2 mt-6">
          <div className="h-5 w-12 bg-gray-200 rounded-md" />
          <div className="h-5 w-12 bg-gray-200 rounded-md" />
          <div className="h-5 w-12 bg-gray-200 rounded-md" />
        </div>
      </div>
      <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
        <div>
          <div className="h-2 w-8 bg-gray-200 rounded" />
          <div className="h-4.5 w-20 bg-gray-200 rounded mt-1.5" />
        </div>
        <div className="h-8 w-24 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Inner InternshipsList component.
 * Must be wrapped inside a `<Suspense>` block because it calls the `useSearchParams()` dynamic hook.
 */
function InternshipsList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State Hooks with explicit TypeScript types.
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Form states read from search parameters
  const searchVal = searchParams.get('search') || '';
  const typeVal = searchParams.get('type') || '';
  const locationVal = searchParams.get('location') || '';
  const categoryVal = searchParams.get('category') || '';
  const sortVal = searchParams.get('sort') || 'newest';
  const pageVal = parseInt(searchParams.get('page') || '1', 10);

  // Local state for the search input to support typing before submission
  const [searchInput, setSearchInput] = useState<string>(searchVal);

  // Sync local search input when search query changes in the URL (e.g. from Landing Hero search)
  useEffect(() => {
    setSearchInput(searchVal);
  }, [searchVal]);

  // Fetch data whenever query parameters change
  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      setError('');
      try {
        const query = new URLSearchParams({
          search: searchVal,
          type: typeVal,
          location: locationVal,
          category: categoryVal,
          sort: sortVal,
          page: pageVal.toString(),
        });

        const res = await fetch(`/api/internships?${query.toString()}`);
        if (!res.ok) {
          throw new Error('Failed to retrieve internship listings.');
        }

        const resData = await res.json();
        if (resData.success) {
          setInternships(resData.data.internships);
          setTotal(resData.data.total);
          setTotalPages(resData.data.pages);
        } else {
          setError(resData.message || 'An error occurred fetching listings.');
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [searchVal, typeVal, locationVal, categoryVal, sortVal, pageVal]);

  /**
   * Updates specific search parameters in the URL, resetting page count.
   */
  const updateUrlParams = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Always reset page to 1 when filters or search change
    if (!updates.hasOwnProperty('page')) {
      params.set('page', '1');
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (value === '') {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    router.push(`?${params.toString()}`);
  };

  /**
   * Action handler for search form submission.
   */
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateUrlParams({ search: searchInput.trim() });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col">
      {/* Header Info */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
          Search Internship Opportunities
        </h2>
        <p className="mt-2 text-sm text-[#1B1B1E] opacity-75">
          Find matching corporate placements, startups, and remote roles in Bangladesh
        </p>
      </div>

      {/* Controls Container: Search, Filter, Sort Dropdowns */}
      <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50 mb-8 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Search roles, companies, or skills..."
              value={searchInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateUrlParams({ search: '' });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-semibold"
              >
                Clear
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#14213D] text-white text-sm font-semibold rounded-xl hover:bg-opacity-95 transition duration-200 cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          {/* Filter 1: Type */}
          <div>
            <label className="block text-xs font-semibold text-[#1B1B1E] mb-1.5 opacity-85">
              Workplace Type
            </label>
            <select
              value={typeVal}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                updateUrlParams({ type: e.target.value })
              }
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
            >
              <option value="">All Types</option>
              <option value="Onsite">Onsite</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Filter 2: Location */}
          <div>
            <label className="block text-xs font-semibold text-[#1B1B1E] mb-1.5 opacity-85">
              Location City
            </label>
            <select
              value={locationVal}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                updateUrlParams({ location: e.target.value })
              }
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
            >
              <option value="">All Locations</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chattogram">Chattogram</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Gazipur">Gazipur</option>
            </select>
          </div>

          {/* Filter 3: Category */}
          <div>
            <label className="block text-xs font-semibold text-[#1B1B1E] mb-1.5 opacity-85">
              Category
            </label>
            <select
              value={categoryVal}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                updateUrlParams({ category: e.target.value })
              }
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
            >
              <option value="">All Categories</option>
              <option value="Software Development">Software Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Marketing & Growth">Marketing & Growth</option>
              <option value="Finance & Accounts">Finance & Accounts</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-[#1B1B1E] mb-1.5 opacity-85">
              Sort By
            </label>
            <select
              value={sortVal}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                updateUrlParams({ sort: e.target.value })
              }
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="stipend-high">Stipend: High to Low</option>
              <option value="stipend-low">Stipend: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Content / Loading State / Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm mb-6 text-center">
          {error}
        </div>
      )}

      {loading ? (
        // Skeleton grid: Shows 8 placeholders during fetching
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : internships.length === 0 ? (
        // Empty State
        <div className="bg-white rounded-[24px] py-16 text-center shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100 flex flex-col items-center justify-center">
          <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
            No Internships Found
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mt-2">
            Try adjusting your search query, location filter, or workplace type select options.
          </p>
        </div>
      ) : (
        // Active Internship Listings: 4 per row on desktop (lg:grid-cols-4)
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {internships.map((internship) => (
            <InternshipCard
              key={internship._id}
              internship={internship}
              matchScore={(internship as any).matchScore}
            />
          ))}
        </div>
      )}

      {/* Pagination Footer Controls */}
      {!loading && totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-4">
          <button
            onClick={() => updateUrlParams({ page: pageVal - 1 })}
            disabled={pageVal === 1}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#14213D] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
          >
            &larr; Previous
          </button>
          
          <span className="text-xs font-semibold text-[#1B1B1E] opacity-75">
            Page {pageVal} of {totalPages}
          </span>

          <button
            onClick={() => updateUrlParams({ page: pageVal + 1 })}
            disabled={pageVal === totalPages}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#14213D] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Default export wrapping client component in Suspense boundary.
 */
export default function InternshipsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col justify-center items-center">
          <p className="text-sm text-gray-500 animate-pulse">Initializing listing components...</p>
        </div>
      }
    >
      <InternshipsList />
    </Suspense>
  );
}
