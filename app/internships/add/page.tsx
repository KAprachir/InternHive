'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

/**
 * AddInternshipPage Component.
 * Form allowing authenticated users to post new internship listings.
 */
export default function AddInternshipPage() {
  const router = useRouter();

  // Better Auth React hook to retrieve session state
  const { data: session, isPending: sessionPending } = authClient.useSession();

  // Form input states with explicit TypeScript types
  const [title, setTitle] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [type, setType] = useState<'Remote' | 'Onsite' | 'Hybrid'>('Onsite');
  const [stipend, setStipend] = useState<string>('');
  const [skillsInput, setSkillsInput] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('Software Development');
  const [shortDescription, setShortDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Protect route client-side: redirect to login if session fails
  useEffect(() => {
    if (!sessionPending && !session) {
      router.push('/login?redirect=/internships/add');
    }
  }, [session, sessionPending, router]);

  /**
   * Action handler for form submission.
   * Calls POST /api/internships.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Input Validation
    if (!title.trim() || !company.trim() || !location.trim() || !description.trim() || !shortDescription.trim() || !category.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    // Convert comma-separated skills input into an array of trimmed strings
    const requiredSkills = skillsInput
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    try {
      const res = await fetch('/api/internships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          company: company.trim(),
          location: location.trim(),
          type,
          stipend: stipend ? Number(stipend) : undefined,
          requiredSkills,
          description: description.trim(),
          category,
          shortDescription: shortDescription.trim(),
          imageUrl: imageUrl.trim() || undefined,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Failed to post internship listing.');
      }

      if (resData.success) {
        // Redirect to manage portal on success
        router.push('/internships/manage');
      } else {
        setError(resData.message || 'Failed to create internship.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Post internship error:', err);
      setError(err.message || 'An error occurred during listing creation.');
      setLoading(false);
    }
  };

  if (sessionPending) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 flex-1 flex justify-center items-center">
        <p className="text-sm text-gray-500 animate-pulse">Checking credentials...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
          Post an Internship Listing
        </h2>
        <p className="mt-2 text-sm text-[#1B1B1E] opacity-75">
          List your internship opportunity to connect with premium candidates
        </p>
      </div>

      {/* Form Container Card */}
      <div className="bg-white py-8 px-6 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] rounded-[24px] sm:px-10 border border-gray-100/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Grid fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block text-sm font-semibold text-[#1B1B1E] mb-1">
                Internship Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="e.g. Software Engineer Intern (Backend)"
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
              />
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="company" className="block text-sm font-semibold text-[#1B1B1E] mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                id="company"
                type="text"
                required
                value={company}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompany(e.target.value)}
                placeholder="e.g. TigerIT Bangladesh"
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
              />
            </div>

            {/* Workplace Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-semibold text-[#1B1B1E] mb-1">
                Workplace Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                value={type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setType(e.target.value as any)
                }
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
              >
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-[#1B1B1E] mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
              >
                <option value="Software Development">Software Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Marketing & Growth">Marketing & Growth</option>
                <option value="Finance & Accounts">Finance & Accounts</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-[#1B1B1E] mb-1">
                Location City <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                type="text"
                required
                value={location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                placeholder="e.g. Karwan Bazar, Dhaka"
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
              />
            </div>

            {/* Stipend */}
            <div>
              <label htmlFor="stipend" className="block text-sm font-semibold text-[#1B1B1E] mb-1">
                Monthly Stipend (BDT) <span className="text-xs text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                id="stipend"
                type="number"
                value={stipend}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStipend(e.target.value)}
                placeholder="e.g. 15000"
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
              />
            </div>

            {/* Skills */}
            <div className="sm:col-span-2">
              <label htmlFor="skills" className="block text-sm font-semibold text-[#1B1B1E] mb-1">
                Required Technical Skills <span className="text-xs text-gray-400 font-normal">(Comma-separated)</span>
              </label>
              <input
                id="skills"
                type="text"
                value={skillsInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSkillsInput(e.target.value)}
                placeholder="e.g. React, TypeScript, Node.js, SQL"
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
              />
            </div>

            {/* Short Description */}
            <div className="sm:col-span-2">
              <label htmlFor="shortDescription" className="block text-sm font-semibold text-[#1B1B1E] mb-1">
                Short Description <span className="text-red-500">*</span> <span className="text-xs text-gray-400 font-normal">(Brief summary for listing card, max 150 chars)</span>
              </label>
              <input
                id="shortDescription"
                type="text"
                required
                maxLength={150}
                value={shortDescription}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShortDescription(e.target.value)}
                placeholder="e.g. Build modern React user interfaces and optimize styling tokens."
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
              />
            </div>

            {/* Optional Image URL */}
            <div className="sm:col-span-2">
              <label htmlFor="imageUrl" className="block text-sm font-semibold text-[#1B1B1E] mb-1">
                Optional Image URL <span className="text-xs text-gray-400 font-normal">(Leave blank to use category fallback placeholder)</span>
              </label>
              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
                placeholder="e.g. https://images.unsplash.com/... (must be a valid public web link)"
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-semibold text-[#1B1B1E] mb-1">
                Role Description & Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={5}
                required
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="Describe the responsibilities, expectations, and any eligibility details for this internship..."
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200 resize-y"
              />
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-100 justify-end">
            <Link
              href="/internships/manage"
              className="px-6 py-3 border border-gray-200 text-[#1B1B1E] text-sm font-semibold rounded-xl hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#14213D] text-white text-sm font-semibold rounded-xl hover:bg-opacity-95 focus:outline-none focus:ring-2 focus:ring-[#14213D] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Posting...' : 'Post Opportunity'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
