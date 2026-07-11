import React from 'react';
import Link from 'next/link';

// Interface defining the expected shape of the Internship data.
// Reused from types/index.ts.
interface Internship {
  id?: string;
  _id?: string; // Mongoose returned ObjectId string
  title: string;
  company: string;
  location: string;
  type: 'Remote' | 'Onsite' | 'Hybrid';
  stipend?: number;
  requiredSkills: string[];
  description: string;
}

interface InternshipCardProps {
  internship: Internship;
  matchScore?: number | null; // Optional skill-match percentage score
}

/**
 * InternshipCard Component.
 * Styled according to the card-based minimalism defined in DESIGN.md.
 * Features Level 1 ambient shadows, 24px (2xl) border radius, and transitions to Level 2 on hover.
 */
export default function InternshipCard({ internship, matchScore }: InternshipCardProps) {
  // Handle both standard SQL-like `id` or MongoDB `_id`
  const internshipId = internship.id || internship._id;

  // Format stipend display
  const displayStipend =
    internship.stipend !== undefined && internship.stipend > 0
      ? `৳ ${internship.stipend.toLocaleString()} / month`
      : 'Unpaid / Negotiable';

  // Determine styling for the skill-match badge based on percentage score
  const getMatchBadgeStyle = (score: number): string => {
    if (score >= 70) {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
    if (score >= 40) {
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    }
    return 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(20,33,61,0.05)] hover:shadow-[0px_8px_30px_rgba(20,33,61,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full border border-gray-100/50">
      <div>
        {/* Header: Company, Match Badge */}
        <div className="flex justify-between items-start gap-4">
          <span className="text-xs font-semibold text-[#FCA311] tracking-wider uppercase">
            {internship.company}
          </span>
          
          {/* Match Score Badge */}
          {matchScore !== undefined && matchScore !== null && (
            <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${getMatchBadgeStyle(matchScore)}`}>
              {matchScore}% Match
            </div>
          )}
        </div>

        {/* Title */}
        <h4 className="text-lg font-bold text-[#14213D] mt-2 mb-3 leading-snug font-[family-name:var(--font-space-grotesk)] line-clamp-1">
          {internship.title}
        </h4>

        {/* Details: Location, Type */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-4 text-xs text-[#1B1B1E] opacity-75">
          <span className="flex items-center">
            <svg className="h-3.5 w-3.5 mr-1 text-[#14213D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {internship.location}
          </span>

          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#14213D]/5 text-[#14213D]">
            {internship.type}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-[#1B1B1E] opacity-80 leading-relaxed mb-5 line-clamp-2">
          {internship.description}
        </p>

        {/* Skills Required */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {internship.requiredSkills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-[10px] font-medium bg-[#F5F3F6] text-[#1B1B1E] rounded-md border border-gray-200"
            >
              {skill}
            </span>
          ))}
          {internship.requiredSkills.length > 3 && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-[#F5F3F6] text-[#1B1B1E] rounded-md">
              +{internship.requiredSkills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer: Stipend & CTA Button */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
        <div>
          <span className="block text-[10px] text-[#1B1B1E] opacity-50 uppercase tracking-wider">Stipend</span>
          <span className="text-xs font-bold text-[#14213D]">{displayStipend}</span>
        </div>

        <Link
          href={`/internships/${internshipId}`}
          className="px-4 py-2 text-xs font-bold text-white bg-[#14213D] rounded-xl hover:bg-opacity-95 transition duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
export type { Internship };
