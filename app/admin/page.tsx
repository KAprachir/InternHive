'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  skills: string[];
}

interface AdminInternship {
  _id: string;
  id?: string;
  title: string;
  company: string;
  location: string;
  type: string;
  stipend?: number;
  postedBy: string;
}

interface AdminApplication {
  _id: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  appliedAt: string;
  internshipId: {
    _id: string;
    title: string;
    company: string;
  } | null;
  applicant: {
    id: string;
    name: string;
    email: string;
    skills: string[];
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  
  // Better Auth React hook to retrieve session state
  const { data: session, isPending: sessionPending } = authClient.useSession();

  // Selected tab state
  const [activeTab, setActiveTab] = useState<'users' | 'internships' | 'applications'>('users');

  // Loaded database data states
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [internships, setInternships] = useState<AdminInternship[]>([]);
  const [applications, setApplications] = useState<AdminApplication[]>([]);

  // Page loading & feedback states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Track action loading (like toggling role, deleting internship, or changing application status)
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Guard routing client-side
  useEffect(() => {
    if (!sessionPending) {
      if (!session) {
        router.push('/login?redirect=/admin');
      } else if (session.user.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [session, sessionPending, router]);

  // Fetch data depending on active tab
  useEffect(() => {
    if (!session || session.user.role !== 'admin') return;

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        if (activeTab === 'users') {
          const res = await fetch('/api/admin/users');
          const data = await res.json();
          if (data.success) {
            setUsers(data.data);
          } else {
            setError(data.message || 'Failed to load users');
          }
        } else if (activeTab === 'internships') {
          const res = await fetch('/api/internships');
          const data = await res.json();
          if (data.success && data.data && Array.isArray(data.data.internships)) {
            setInternships(data.data.internships);
          } else {
            setError(data.message || 'Failed to load internships');
          }
        } else if (activeTab === 'applications') {
          const res = await fetch('/api/admin/applications');
          const data = await res.json();
          if (data.success) {
            setApplications(data.data);
          } else {
            setError(data.message || 'Failed to load applications');
          }
        }
      } catch (err: any) {
        console.error('Fetch administration data error:', err);
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, session]);

  // Helper alert auto-dismissal
  const triggerSuccessAlert = (message: string) => {
    setSuccessMsg(message);
    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  /**
   * Toggles role between 'admin' and 'student'
   */
  const handleToggleRole = async (targetUser: AdminUser) => {
    const newRole = targetUser.role === 'admin' ? 'student' : 'admin';
    
    if (targetUser.id === session?.user.id) {
      setError('You cannot demote yourself from the admin role.');
      return;
    }

    if (!window.confirm(`Are you sure you want to change ${targetUser.name}'s role to ${newRole}?`)) {
      return;
    }

    setActionLoading(targetUser.id);
    setError('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUser.id, role: newRole }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update user role');
      }

      // Update state
      setUsers(prev =>
        prev.map(u => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );
      triggerSuccessAlert(`Successfully changed role of ${targetUser.name} to ${newRole}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during updating user role');
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Deletes an internship listing (admin bypass ownership)
   */
  const handleDeleteInternship = async (internshipId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the internship listing "${title}"? This will remove it permanently.`)) {
      return;
    }

    setActionLoading(internshipId);
    setError('');

    try {
      const res = await fetch(`/api/internships/${internshipId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete internship');
      }

      // Update state
      setInternships(prev => prev.filter(item => (item._id || item.id) !== internshipId));
      triggerSuccessAlert(`Successfully deleted listing "${title}"`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while deleting internship');
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Updates an application status
   */
  const handleUpdateApplicationStatus = async (appId: string, newStatus: 'Applied' | 'Interview' | 'Offer' | 'Rejected') => {
    setActionLoading(appId);
    setError('');

    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update application status');
      }

      // Update state
      setApplications(prev =>
        prev.map(app => (app._id === appId ? { ...app, status: newStatus } : app))
      );
      triggerSuccessAlert(`Updated application status to ${newStatus}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while updating application');
    } finally {
      setActionLoading(null);
    }
  };

  // Filter list matching search query
  const getFilteredUsers = () => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const getFilteredInternships = () => {
    return internships.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getFilteredApplications = () => {
    return applications.filter(app =>
      (app.internshipId?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.internshipId?.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Date formatter helper
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
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

  if (sessionPending || !session || session.user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex-1 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#14213D] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-semibold animate-pulse">Authenticating administration credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col space-y-8">
      {/* Title Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
          System Administration Panel
        </h2>
        <p className="mt-2 text-sm text-[#1B1B1E] opacity-75">
          Manage system users, moderate posted internship listings, and update student application statuses.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm flex justify-between items-center animate-fade-in shadow-sm">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 font-bold text-xs">Dismiss</button>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl text-sm flex justify-between items-center animate-fade-in shadow-sm">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-800 font-bold text-xs">Dismiss</button>
        </div>
      )}

      {/* Tabs Header Selection Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-2 gap-4">
        {/* Navigation Tabs */}
        <div className="flex space-x-6 text-sm font-semibold">
          <button
            onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
            className={`pb-3 relative transition duration-200 cursor-pointer ${
              activeTab === 'users' ? 'text-[#FCA311]' : 'text-gray-500 hover:text-[#14213D]'
            }`}
          >
            Users ({users.length})
            {activeTab === 'users' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FCA311] rounded-full" />
            )}
          </button>
          
          <button
            onClick={() => { setActiveTab('internships'); setSearchQuery(''); }}
            className={`pb-3 relative transition duration-200 cursor-pointer ${
              activeTab === 'internships' ? 'text-[#FCA311]' : 'text-gray-500 hover:text-[#14213D]'
            }`}
          >
            Internships ({internships.length})
            {activeTab === 'internships' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FCA311] rounded-full" />
            )}
          </button>

          <button
            onClick={() => { setActiveTab('applications'); setSearchQuery(''); }}
            className={`pb-3 relative transition duration-200 cursor-pointer ${
              activeTab === 'applications' ? 'text-[#FCA311]' : 'text-gray-500 hover:text-[#14213D]'
            }`}
          >
            Applications ({applications.length})
            {activeTab === 'applications' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FCA311] rounded-full" />
            )}
          </button>
        </div>

        {/* Global Tab Search Input */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FCA311] focus:border-transparent transition duration-200"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        // Skeleton Loaders
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] space-y-4 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-10 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100 overflow-hidden">
          
          {/* USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-left text-xs">
                <thead>
                  <tr className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold bg-[#F5F3F6]/20">
                    <th className="py-3.5 px-6">Name</th>
                    <th className="py-3.5 px-6">Email</th>
                    <th className="py-3.5 px-6">Skills Profile</th>
                    <th className="py-3.5 px-6">Access Role</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[#1B1B1E] opacity-90 font-medium">
                  {getFilteredUsers().length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-400 font-normal">
                        No users match search filters
                      </td>
                    </tr>
                  ) : (
                    getFilteredUsers().map((user) => (
                      <tr key={user.id} className="hover:bg-[#F5F3F6]/10 transition duration-150">
                        <td className="py-4.5 px-6 font-bold text-[#14213D]">{user.name}</td>
                        <td className="py-4.5 px-6 text-gray-500">{user.email}</td>
                        <td className="py-4.5 px-6">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {user.skills.length > 0 ? (
                              user.skills.map((skill, i) => (
                                <span
                                  key={i}
                                  className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-semibold"
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 italic text-[10px] font-normal">No skills listed</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4.5 px-6">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              user.role === 'admin'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4.5 px-6 text-right">
                          <button
                            onClick={() => handleToggleRole(user)}
                            disabled={actionLoading === user.id}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition duration-200 border cursor-pointer disabled:opacity-50 ${
                              user.role === 'admin'
                                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                                : 'bg-[#14213D] text-white border-transparent hover:bg-opacity-95'
                            }`}
                          >
                            {actionLoading === user.id ? 'Updating...' : user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* INTERNSHIPS MANAGEMENT */}
          {activeTab === 'internships' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-left text-xs">
                <thead>
                  <tr className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold bg-[#F5F3F6]/20">
                    <th className="py-3.5 px-6">Opportunity Details</th>
                    <th className="py-3.5 px-6">Location</th>
                    <th className="py-3.5 px-6">Arrangement</th>
                    <th className="py-3.5 px-6">Stipend</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[#1B1B1E] opacity-90 font-medium">
                  {getFilteredInternships().length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-400 font-normal">
                        No internships match search filters
                      </td>
                    </tr>
                  ) : (
                    getFilteredInternships().map((item) => {
                      const id = item._id || item.id;
                      if (!id) return null;

                      return (
                        <tr key={id} className="hover:bg-[#F5F3F6]/10 transition duration-150">
                          <td className="py-4.5 px-6">
                            <span className="block font-bold text-[#14213D]">{item.title}</span>
                            <span className="block text-[10px] text-gray-400 mt-0.5">{item.company}</span>
                          </td>
                          <td className="py-4.5 px-6 text-gray-500">{item.location}</td>
                          <td className="py-4.5 px-6">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#14213D]/5 text-[#14213D]">
                              {item.type}
                            </span>
                          </td>
                          <td className="py-4.5 px-6 text-gray-400 font-semibold">
                            {item.stipend !== undefined && item.stipend > 0
                              ? `৳ ${item.stipend.toLocaleString()}`
                              : 'Negotiable'}
                          </td>
                          <td className="py-4.5 px-6 text-right space-x-3">
                            <Link
                              href={`/internships/${id}`}
                              className="inline-block px-3 py-1.5 border border-gray-200 rounded-lg text-[10px] font-semibold text-[#14213D] hover:bg-gray-50 transition duration-200"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => handleDeleteInternship(id, item.title)}
                              disabled={actionLoading === id}
                              className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-[10px] font-semibold text-red-600 hover:bg-red-100 transition duration-200 cursor-pointer disabled:opacity-50"
                            >
                              {actionLoading === id ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* APPLICATIONS MANAGEMENT */}
          {activeTab === 'applications' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-left text-xs">
                <thead>
                  <tr className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold bg-[#F5F3F6]/20">
                    <th className="py-3.5 px-6">Internship Position</th>
                    <th className="py-3.5 px-6">Applicant (Student)</th>
                    <th className="py-3.5 px-6">Applied Date</th>
                    <th className="py-3.5 px-6">Current Status</th>
                    <th className="py-3.5 px-6 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[#1B1B1E] opacity-90 font-medium">
                  {getFilteredApplications().length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-400 font-normal">
                        No applications match search filters
                      </td>
                    </tr>
                  ) : (
                    getFilteredApplications().map((app) => (
                      <tr key={app._id} className="hover:bg-[#F5F3F6]/10 transition duration-150">
                        <td className="py-4.5 px-6">
                          {app.internshipId ? (
                            <>
                              <span className="block font-bold text-[#14213D]">{app.internshipId.title}</span>
                              <span className="block text-[10px] text-gray-400 mt-0.5">{app.internshipId.company}</span>
                            </>
                          ) : (
                            <span className="text-gray-400 italic">Listing Deleted</span>
                          )}
                        </td>
                        <td className="py-4.5 px-6">
                          <span className="block font-bold text-[#14213D]">{app.applicant.name}</span>
                          <span className="block text-[10px] text-gray-400 mt-0.5">{app.applicant.email}</span>
                          <div className="flex flex-wrap gap-1 mt-1 max-w-xs">
                            {app.applicant.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-1 py-0.5 bg-gray-100 text-gray-500 rounded text-[8px]"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4.5 px-6 text-gray-400">{formatDate(app.appliedAt)}</td>
                        <td className="py-4.5 px-6">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4.5 px-6 text-right">
                          <div className="inline-flex flex-wrap items-center gap-1.5 justify-end">
                            {actionLoading === app._id ? (
                              <span className="text-[10px] text-gray-400 animate-pulse font-semibold">Saving status...</span>
                            ) : (
                              (['Applied', 'Interview', 'Offer', 'Rejected'] as const).map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleUpdateApplicationStatus(app._id, status)}
                                  disabled={app.status === status}
                                  className={`px-2 py-1 rounded text-[9px] font-bold border transition duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                                    status === 'Offer'
                                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                                      : status === 'Interview'
                                      ? 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100'
                                      : status === 'Applied'
                                      ? 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100'
                                      : 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100'
                                  }`}
                                >
                                  {status}
                                </button>
                              ))
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
        </div>
      )}
    </div>
  );
}
