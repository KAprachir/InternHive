'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import InternshipCard, { Internship } from '@/components/InternshipCard';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * InternshipDetailPage Component.
 * Shows detailed specifications, required skills, and matches.
 * Provides the application triggering flow.
 */
export default function InternshipDetailPage({ params }: PageProps) {
  const router = useRouter();

  // Unwrap dynamic params promise using React.use()
  const resolvedParams = use(params);
  const { id: internshipId } = resolvedParams;

  // Better Auth React hook to retrieve session state
  const { data: session, isPending: sessionPending } = authClient.useSession();

  // Component states with explicit TypeScript types
  const [internship, setInternship] = useState<Internship | null>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [related, setRelated] = useState<Internship[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [relatedLoading, setRelatedLoading] = useState<boolean>(true);
  const [applyLoading, setApplyLoading] = useState<boolean>(false);
  const [alreadyApplied, setAlreadyApplied] = useState<boolean>(false);
  
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Fetch internship details and calculate match percentage
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/internships/${internshipId}`);
        if (!res.ok) {
          throw new Error('Failed to retrieve internship details.');
        }

        const resData = await res.json();
        if (resData.success) {
          setInternship(resData.data.internship);
          setMatchScore(resData.data.matchScore);
          
          // Trigger related fetch based on the workplace type
          fetchRelated(resData.data.internship.type);
        } else {
          setError(resData.message || 'Listing not found.');
        }
      } catch (err: any) {
        console.error('Fetch detail error:', err);
        setError(err.message || 'Failed to connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [internshipId]);

  // Check if user has already applied (only if logged in)
  useEffect(() => {
    if (!session) return;

    const checkAppliedStatus = async () => {
      try {
        const res = await fetch('/api/applications');
        if (res.ok) {
          const resData = await res.json();
          if (resData.success && Array.isArray(resData.data)) {
            // Check if any application matches current internshipId
            const isApplied = resData.data.some(
              (app: any) => (app.internshipId?._id || app.internshipId) === internshipId
            );
            setAlreadyApplied(isApplied);
          }
        }
      } catch (err) {
        console.error('Failed to verify application status:', err);
      }
    };

    checkAppliedStatus();
  }, [session, internshipId]);

  /**
   * Fetches 3 related internships of the same workplace type, excluding the current ID.
   */
  const fetchRelated = async (type: string) => {
    setRelatedLoading(true);
    try {
      const res = await fetch(`/api/internships?type=${type}`);
      if (res.ok) {
        const resData = await res.json();
        if (resData.success && resData.data && Array.isArray(resData.data.internships)) {
          // Filter out current internship
          const filtered = resData.data.internships.filter(
            (item: Internship) => (item.id || item._id) !== internshipId
          );
          setRelated(filtered.slice(0, 3));
        }
      }
    } catch (err) {
      console.error('Failed to load related listings:', err);
    } finally {
      setRelatedLoading(false);
    }
  };

  /**
   * Triggers the application submission flow.
   */
  const handleApply = async () => {
    setError('');
    setSuccessMsg('');

    // 1. Guard check: Redirect to login if user session is absent
    if (!session) {
      router.push(`/login?redirect=/internships/${internshipId}`);
      return;
    }

    setApplyLoading(true);

    try {
      // 2. Submit application to API
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ internshipId }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Failed to submit application.');
      }

      if (resData.success) {
        setSuccessMsg('Your application has been submitted successfully!');
        setAlreadyApplied(true);
      } else {
        setError(resData.message || 'Failed to complete application.');
      }
    } catch (err: any) {
      console.error('Apply submit error:', err);
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center items-center">
        <div className="w-full bg-white rounded-[24px] p-8 shadow-[0px_4px_20px_rgba(20,33,61,0.05)] border border-gray-100 animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-1/2 bg-gray-200 rounded mt-4" />
          <div className="h-6 w-32 bg-gray-200 rounded mt-3" />
          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
            <div className="h-10 bg-gray-100 rounded-xl" />
            <div className="h-10 bg-gray-100 rounded-xl" />
          </div>
          <div className="h-20 bg-gray-100 rounded-xl mt-8" />
        </div>
      </div>
    );
  }

  if (error && !internship) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center items-center">
        <div className="bg-white rounded-[24px] p-8 shadow-md border border-gray-100 text-center max-w-md">
          <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
            Error Loading Details
          </h3>
          <p className="text-xs text-gray-500 mt-2">{error}</p>
          <Link
            href="/internships"
            className="mt-6 inline-block px-4 py-2 bg-[#14213D] text-white text-xs font-semibold rounded-xl hover:bg-opacity-95 transition duration-200"
          >
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  if (!internship) return null;

  const getFallbackImage = (category: string = ''): string => {
    const cleanCategory = category.toLowerCase();
    if (cleanCategory.includes('software') || cleanCategory.includes('dev') || cleanCategory.includes('code')) {
      return 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1200&q=80';
    }
    if (cleanCategory.includes('design') || cleanCategory.includes('ui') || cleanCategory.includes('ux') || cleanCategory.includes('creative')) {
      return 'https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=1200&q=80';
    }
    if (cleanCategory.includes('marketing') || cleanCategory.includes('growth') || cleanCategory.includes('social')) {
      return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
    }
    if (cleanCategory.includes('finance') || cleanCategory.includes('account') || cleanCategory.includes('data')) {
      return 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80';
    }
    return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';
  };

  const detailImage = internship.imageUrl || getFallbackImage(internship.category);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/internships"
          className="text-xs font-semibold text-[#14213D] hover:text-[#FCA311] transition duration-200 flex items-center gap-1.5"
        >
          &larr; Back to Listings
        </Link>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Internship Core Content (Col Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50">
            {/* Image Banner */}
            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden mb-6 bg-gray-100">
              <img
                src={detailImage}
                alt={internship.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Header: Company, Title */}
            <div>
              <span className="text-xs font-bold text-[#FCA311] tracking-wider uppercase">
                {internship.company}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] mt-2 mb-4 leading-snug font-[family-name:var(--font-space-grotesk)]">
                {internship.title}
              </h1>
            </div>

            {/* Workplace metadata info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-100 text-xs text-[#1B1B1E] opacity-80">
              <div className="space-y-1">
                <span className="block text-[10px] text-[#1B1B1E] opacity-50 uppercase tracking-wider">Location</span>
                <span className="font-semibold">{internship.location}</span>
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] text-[#1B1B1E] opacity-50 uppercase tracking-wider">Workspace Type</span>
                <span className="font-semibold">{internship.type}</span>
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] text-[#1B1B1E] opacity-50 uppercase tracking-wider">Category</span>
                <span className="font-semibold">{internship.category || 'Software Development'}</span>
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] text-[#1B1B1E] opacity-50 uppercase tracking-wider">Monthly Stipend</span>
                <span className="font-semibold">
                  {internship.stipend !== undefined && internship.stipend > 0
                    ? `৳ ${internship.stipend.toLocaleString()}`
                    : 'Unpaid / Negotiable'}
                </span>
              </div>
            </div>

            {/* Description / Overview */}
            <div className="mt-6 space-y-4">
              <h3 className="text-base font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
                Role Description & Overview
              </h3>
              <p className="text-sm text-[#1B1B1E] opacity-85 leading-relaxed whitespace-pre-line">
                {internship.description}
              </p>
            </div>

            {/* Required Skills */}
            <div className="mt-8 space-y-4">
              <h3 className="text-base font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
                Required Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {internship.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#F5F3F6] text-[#1B1B1E] text-xs font-medium rounded-lg border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Apply Action Panel / Skill-Match Badge */}
        <div className="space-y-6">
          
          {/* Action Card */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50 space-y-6">
            <h3 className="text-base font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)] border-b border-gray-100 pb-3">
              Application Desk
            </h3>

            {/* Alert boxes */}
            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-xs">
                {successMsg}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs">
                {error}
              </div>
            )}

            {/* Dynamic Skill-Match Badge (Only shows when user is logged in) */}
            {!sessionPending && session && matchScore !== null && (
              <div className="p-4 bg-[#F5F3F6] rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Your Skill Match</span>
                  <span className="text-sm font-semibold text-[#14213D]">Overlapping Requirements</span>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-full text-sm font-extrabold ${
                    matchScore >= 70
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : matchScore >= 40
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-gray-50 text-gray-700 border border-gray-200'
                  }`}
                >
                  {matchScore}%
                </div>
              </div>
            )}

            {/* Apply Button Flow */}
            <button
              onClick={handleApply}
              disabled={applyLoading || alreadyApplied}
              className={`w-full py-3.5 px-4 font-semibold text-sm rounded-xl transition duration-200 shadow-md cursor-pointer ${
                alreadyApplied
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                  : 'bg-[#FCA311] hover:bg-opacity-95 text-white'
              }`}
            >
              {applyLoading
                ? 'Submitting...'
                : alreadyApplied
                ? 'Applied Successfully'
                : session
                ? 'Apply Now'
                : 'Login to Apply'}
            </button>

            {/* Instructions */}
            <p className="text-[10px] text-gray-400 text-center leading-relaxed">
              Applying links your account profile, registered skills list, and details immediately. Ensure your profile is updated.
            </p>
          </div>

        </div>

      </div>

      {/* Related Internships Section */}
      <div className="mt-16 border-t border-gray-100 pt-10">
        <h3 className="text-xl font-bold text-[#14213D] mb-6 font-[family-name:var(--font-space-grotesk)]">
          Related Opportunities
        </h3>
        
        {relatedLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="h-44 bg-gray-100 rounded-[24px] animate-pulse" />
            <div className="h-44 bg-gray-100 rounded-[24px] animate-pulse" />
            <div className="h-44 bg-gray-100 rounded-[24px] animate-pulse" />
          </div>
        ) : related.length === 0 ? (
          <p className="text-xs text-gray-500">No other matching workplace type listings currently available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((item) => (
              <InternshipCard key={item._id} internship={item} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
