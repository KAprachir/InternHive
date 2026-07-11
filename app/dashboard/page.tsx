'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { authClient } from '@/lib/auth-client';

// Define Interface representing Application retrieved from API.
interface ApplicationItem {
  _id: string;
  internshipId: {
    _id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    stipend?: number;
  } | null;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  appliedAt: string;
}

/**
 * Skeleton Loader Component for the Dashboard.
 */
function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded" />
      
      {/* 4 Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-[24px] p-6 h-28 border border-gray-100/50" />
        ))}
      </div>

      {/* Chart and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-[24px] p-6 h-80 border border-gray-100/50 lg:col-span-1" />
        <div className="bg-white rounded-[24px] p-6 h-80 border border-gray-100/50 lg:col-span-2" />
      </div>
    </div>
  );
}

/**
 * Dashboard Component.
 * Protected route rendering application statistics and status charts.
 */
export default function DashboardPage() {
  const router = useRouter();

  // Better Auth React hook to retrieve session state
  const { data: session, isPending: sessionPending } = authClient.useSession();

  // Component states with explicit TypeScript types
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // Mounted toggle used to delay Recharts rendering and avoid hydration mismatches
  const [mounted, setMounted] = useState<boolean>(false);

  // Set mounted on client load
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch applications list
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/applications');
        if (!res.ok) {
          throw new Error('Failed to retrieve applications.');
        }

        const resData = await res.json();
        if (resData.success) {
          // Filter out null/deleted internship mappings safely
          const validApps = (resData.data || []).filter(
            (app: ApplicationItem) => app.internshipId !== null
          );
          setApplications(validApps);
        } else {
          setError(resData.message || 'An error occurred loading dashboard data.');
        }
      } catch (err: any) {
        console.error('Fetch dashboard error:', err);
        setError(err.message || 'Failed to connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchApplications();
    } else if (!sessionPending && !session) {
      // If not logged in and session is done loading, redirect to login
      router.push('/login?redirect=/dashboard');
    }
  }, [session, sessionPending, router]);

  // Derive counts from applications
  const countByStatus = (status: 'Applied' | 'Interview' | 'Offer' | 'Rejected'): number => {
    return applications.filter((app) => app.status === status).length;
  };

  const totalCount = applications.length;
  const appliedCount = countByStatus('Applied');
  const interviewCount = countByStatus('Interview');
  const offerCount = countByStatus('Offer');
  const rejectedCount = countByStatus('Rejected');

  // Format Recharts status data
  const chartData = [
    { name: 'Applied', value: appliedCount, color: '#FCA311' }, // Amber
    { name: 'Interview', value: interviewCount, color: '#3B82F6' }, // Blue
    { name: 'Offers', value: offerCount, color: '#10B981' }, // Emerald
    { name: 'Rejected', value: rejectedCount, color: '#EF4444' }, // Red
  ].filter((item) => item.value > 0); // Only render slices with count > 0

  // Date formatter
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Status badge styling helper
  const getStatusBadgeStyle = (status: string): string => {
    switch (status) {
      case 'Offer':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Interview':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Applied':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  if (sessionPending || loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center items-center">
        <div className="bg-white rounded-[24px] p-8 shadow-md border border-gray-100 text-center max-w-md">
          <h3 className="text-lg font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
            Failed to Load Dashboard
          </h3>
          <p className="text-xs text-gray-500 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-[#14213D] text-white text-xs font-semibold rounded-xl hover:bg-opacity-95 transition duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
          Application Tracker Dashboard
        </h2>
        <p className="mt-2 text-sm text-[#1B1B1E] opacity-75">
          Monitor status updates and placements for your submitted applications
        </p>
      </div>

      {/* Summary Cards Row (Counts derived from applications) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50 flex flex-col justify-between">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Total Submitted</span>
          <span className="text-3xl font-bold text-[#14213D] mt-2 font-[family-name:var(--font-space-grotesk)]">
            {totalCount}
          </span>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50 flex flex-col justify-between">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Interviews</span>
          <span className="text-3xl font-bold text-blue-600 mt-2 font-[family-name:var(--font-space-grotesk)]">
            {interviewCount}
          </span>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50 flex flex-col justify-between">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Offers Received</span>
          <span className="text-3xl font-bold text-emerald-600 mt-2 font-[family-name:var(--font-space-grotesk)]">
            {offerCount}
          </span>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50 flex flex-col justify-between">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Rejections</span>
          <span className="text-3xl font-bold text-red-600 mt-2 font-[family-name:var(--font-space-grotesk)]">
            {rejectedCount}
          </span>
        </div>
      </div>

      {totalCount === 0 ? (
        // Empty State: Direct user to listing page
        <div className="bg-white rounded-[24px] py-20 text-center shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100 flex flex-col items-center justify-center">
          <svg className="h-14 w-14 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <h3 className="text-lg font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
            No Applications Yet
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mt-2 mb-6">
            You haven't submitted any internship applications. Browse listed opportunities to launch your career.
          </p>
          <Link
            href="/internships"
            className="px-6 py-3 bg-[#FCA311] hover:bg-opacity-95 text-white font-semibold text-sm rounded-xl transition duration-200 shadow-md"
          >
            Find Internships
          </Link>
        </div>
      ) : (
        /* Visual Layout Grid: Chart (left), Data Table (right) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recharts Pie Visualization (Col Span 1) */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50 flex flex-col justify-between lg:col-span-1">
            <h3 className="text-base font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)] mb-4">
              Status Distribution
            </h3>

            <div className="h-[240px] flex items-center justify-center">
              {mounted && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '11px', marginTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-xs text-gray-400">Loading status data...</div>
              )}
            </div>
          </div>

          {/* Table List of Applications (Col Span 2) */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50 lg:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)] mb-4">
                Applications Activity
              </h3>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 text-left text-xs">
                  <thead>
                    <tr className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Internship Opportunity</th>
                      <th className="py-3 px-4">Employer</th>
                      <th className="py-3 px-4">Applied On</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-[#1B1B1E] opacity-90 font-medium">
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-[#F5F3F6]/20 transition duration-150">
                        <td className="py-4 px-4 font-bold text-[#14213D]">
                          {app.internshipId ? (
                            <Link href={`/internships/${app.internshipId._id}`} className="hover:text-[#FCA311] transition duration-200">
                              {app.internshipId.title}
                            </Link>
                          ) : (
                            <span className="text-gray-400 font-normal">Removed Internship</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-gray-500">
                          {app.internshipId?.company || 'N/A'}
                        </td>
                        <td className="py-4 px-4 text-gray-400">
                          {formatDate(app.appliedAt)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeStyle(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
