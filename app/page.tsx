'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import InternshipCard from '@/components/InternshipCard';

// Sample mock data for Featured Internships (realistic content, no placeholder text)
const mockFeaturedInternships = [
  {
    _id: 'intern-1',
    title: 'Software Engineer Intern (Frontend)',
    company: 'TigerIT Bangladesh',
    location: 'Dhaka (Hybrid)',
    type: 'Hybrid' as const,
    stipend: 15000,
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS'],
    description: 'Collaborate with our engineering team to build next-generation biometric dashboards. Work with React, TypeScript, and modern styling libraries.',
  },
  {
    _id: 'intern-2',
    title: 'Product Design Intern (UI/UX)',
    company: 'Pathao',
    location: 'Dhaka (Onsite)',
    type: 'Onsite' as const,
    stipend: 12000,
    requiredSkills: ['Figma', 'Prototyping', 'User Research'],
    description: 'Help iterate and design interfaces for our ride-sharing and food delivery platforms. Design interactive layouts and participate in user studies.',
  },
  {
    _id: 'intern-3',
    title: 'Data Analyst Intern',
    company: 'bKash Limited',
    location: 'Dhaka (Onsite)',
    type: 'Onsite' as const,
    stipend: 18000,
    requiredSkills: ['SQL', 'Python', 'Excel'],
    description: 'Analyze transaction patterns and compile data insights for digital wallet growth. Work closely with product managers to deliver SQL reports.',
  },
];

// Sample categories
const mockCategories = [
  { name: 'Software Development', icon: '💻', count: 42 },
  { name: 'UI/UX Design', icon: '🎨', count: 28 },
  { name: 'Marketing & Growth', icon: '🚀', count: 19 },
  { name: 'Finance & Accounts', icon: '📊', count: 12 },
];

// Sample testimonials
const mockTestimonials = [
  {
    quote: 'InternHive helped me find my first Software Engineer Internship at TigerIT. The Skill-Match score gave me the confidence to apply!',
    name: 'Tariqul Islam',
    role: 'Student, BUET',
  },
  {
    quote: 'An incredibly streamlined platform. I applied to three design positions and got interviews for two. The tracker helped me stay organized.',
    name: 'Sabiha Tasnim',
    role: 'Student, NSU',
  },
  {
    quote: 'As an employer, InternHive has made filtering student candidates highly efficient. We matched with a fantastic React intern within a week.',
    name: 'Rahat Rahman',
    role: 'HR Manager, Pathao',
  },
];

// Sample companies
const mockCompanies = ['TigerIT', 'Pathao', 'bKash', 'ShopUp', 'Chaldal', 'Sheba.xyz'];

/**
 * Landing Page Component.
 * Contains Hero section (65vh max height) with search redirection,
 * followed by the 7 sections specified in plan.md Section 10.
 */
export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');

  /**
   * Action handler for hero search form submission.
   * Redirects user to search results in /internships.
   */
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/internships?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/internships');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* 1. HERO SECTION (Height limited to 60-70% of viewport) */}
      <section className="relative min-h-[60vh] max-h-[70vh] bg-gradient-to-br from-[#14213D] via-[#1a2c4e] to-[#0c1322] flex items-center justify-center text-white px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Abstract background shapes to add premium styling */}
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#FCA311] blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#14213D] blur-3xl border-2 border-white" />
        </div>

        <div className="relative max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-[family-name:var(--font-space-grotesk)] leading-tight">
            Launch Your Career with <span className="text-[#FCA311]">InternHive</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
            Connecting university students in Bangladesh with premium internships and entry-level positions. Check your skill-match score and track applications dynamically.
          </p>

          {/* Hero Search Bar Form */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3 mt-4">
            <input
              type="text"
              placeholder="Search by title, company, or skills..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="flex-grow px-4 py-3.5 bg-white text-[#1B1B1E] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311] border border-gray-200"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-[#FCA311] hover:bg-opacity-95 text-white font-semibold text-sm rounded-xl transition duration-200 shadow-md cursor-pointer"
            >
              Search Roles
            </button>
          </form>
        </div>
      </section>

      {/* 2. FEATURED INTERNSHIPS SECTION */}
      <section className="py-16 bg-[#F5F3F6] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
                Featured Internships
              </h2>
              <p className="text-xs sm:text-sm text-[#1B1B1E] opacity-75 mt-2">
                Hand-picked high-growth opportunities for student talents
              </p>
            </div>
            <Link
              href="/internships"
              className="text-sm font-semibold text-[#FCA311] hover:text-opacity-90 flex items-center gap-1 transition duration-200"
            >
              Browse All
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockFeaturedInternships.map((internship) => (
              <InternshipCard key={internship._id} internship={internship} matchScore={85} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] font-[family-name:var(--font-space-grotesk)] mb-3">
            How It Works
          </h2>
          <p className="text-sm text-[#1B1B1E] opacity-75 max-w-xl mx-auto mb-12">
            Get matched and placed in 3 simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 p-6 hover:bg-[#F5F3F6]/50 rounded-[24px] transition duration-200">
              <div className="w-12 h-12 rounded-full bg-[#14213D]/5 flex items-center justify-center text-[#14213D] text-xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-lg font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
                Create Account
              </h3>
              <p className="text-xs text-[#1B1B1E] opacity-75 leading-relaxed">
                Register as a student or employer. Build your profile and input your core technologies and skills.
              </p>
            </div>

            <div className="space-y-4 p-6 hover:bg-[#F5F3F6]/50 rounded-[24px] transition duration-200">
              <div className="w-12 h-12 rounded-full bg-[#14213D]/5 flex items-center justify-center text-[#14213D] text-xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-lg font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
                Check Skill-Match
              </h3>
              <p className="text-xs text-[#1B1B1E] opacity-75 leading-relaxed">
                Browse listed internships. Each opportunity dynamically shows a percentage score matching your skills.
              </p>
            </div>

            <div className="space-y-4 p-6 hover:bg-[#F5F3F6]/50 rounded-[24px] transition duration-200">
              <div className="w-12 h-12 rounded-full bg-[#14213D]/5 flex items-center justify-center text-[#14213D] text-xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-lg font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
                Apply & Track
              </h3>
              <p className="text-xs text-[#1B1B1E] opacity-75 leading-relaxed">
                Submit your application in one click. Monitor your application status in real-time via your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CATEGORIES SECTION */}
      <section className="py-16 bg-[#F5F3F6] px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] font-[family-name:var(--font-space-grotesk)] mb-3">
              Explore by Category
            </h2>
            <p className="text-sm text-[#1B1B1E] opacity-75">
              Find internships matching your specific domain
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockCategories.map((category, index) => (
              <Link
                key={index}
                href={`/internships?category=${encodeURIComponent(category.name)}`}
                className="bg-white p-6 rounded-[24px] shadow-[0px_4px_20px_rgba(20,33,61,0.02)] hover:shadow-[0px_8px_30px_rgba(20,33,61,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-4 border border-gray-100/50"
              >
                <div className="text-3xl bg-[#F5F3F6] p-3.5 rounded-xl">
                  {category.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
                    {category.name}
                  </h4>
                  <p className="text-xs text-[#1B1B1E] opacity-50 mt-1">{category.count} listings</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PLATFORM STATISTICS SECTION */}
      <section className="py-16 bg-[#14213D] text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="block text-4xl sm:text-5xl font-extrabold text-[#FCA311] font-[family-name:var(--font-space-grotesk)]">
                1,200+
              </span>
              <span className="text-sm text-gray-300 font-medium">Registered Students</span>
            </div>
            <div className="space-y-2">
              <span className="block text-4xl sm:text-5xl font-extrabold text-[#FCA311] font-[family-name:var(--font-space-grotesk)]">
                80+
              </span>
              <span className="text-sm text-gray-300 font-medium">Partner Companies</span>
            </div>
            <div className="space-y-2">
              <span className="block text-4xl sm:text-5xl font-extrabold text-[#FCA311] font-[family-name:var(--font-space-grotesk)]">
                450+
              </span>
              <span className="text-sm text-gray-300 font-medium">Successful Placements</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] font-[family-name:var(--font-space-grotesk)] mb-3">
              Student Success Stories
            </h2>
            <p className="text-sm text-[#1B1B1E] opacity-75">
              Read what students and recruiters say about us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockTestimonials.map((t, index) => (
              <div
                key={index}
                className="bg-[#F5F3F6]/50 rounded-[24px] p-8 border border-gray-100 flex flex-col justify-between"
              >
                <p className="text-xs sm:text-sm text-[#1B1B1E] opacity-80 leading-relaxed italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <h4 className="text-sm font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
                    {t.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-[#1B1B1E] opacity-50 mt-1">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TOP COMPANIES SECTION */}
      <section className="py-16 bg-[#F5F3F6] px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-md font-semibold text-[#1B1B1E] opacity-50 uppercase tracking-wider mb-8">
            Top Companies Hiring
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-70">
            {mockCompanies.map((company, index) => (
              <div
                key={index}
                className="text-lg font-bold text-[#14213D] tracking-tight font-[family-name:var(--font-space-grotesk)] hover:scale-105 transition duration-200 cursor-pointer"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER SIGNUP SECTION */}
      <section className="py-16 bg-[#14213D] text-white text-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative max-w-xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-space-grotesk)]">
            Never Miss an Opportunity
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
            Subscribe to our weekly newsletter and receive the latest internships directly in your inbox.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-grow px-4 py-3 bg-white text-[#1B1B1E] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311] border border-gray-700"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#FCA311] hover:bg-opacity-95 text-white font-semibold text-sm rounded-xl transition duration-200 shadow-md cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
