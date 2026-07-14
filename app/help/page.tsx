import React from 'react';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 flex flex-col space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
          Help Center & Support
        </h1>
        <p className="text-sm text-[#1B1B1E] opacity-75 max-w-sm mx-auto">
          Find answers to common questions about using the InternHive platform.
        </p>
      </div>

      {/* FAQs Container */}
      <div className="bg-white rounded-[24px] p-8 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50 space-y-8 text-sm text-[#1B1B1E] opacity-90 leading-relaxed">
        
        <div className="space-y-2">
          <h3 className="font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)] text-base">
            Q: What is the Skill-Match Score?
          </h3>
          <p className="text-xs text-[#1B1B1E]/80">
            A: The Skill-Match Score calculates the percentage overlap between the technical skills listed on your student profile and the required technical skills posted by employers. Ensure your profile is updated to see accurate match scores.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)] text-base">
            Q: How do I post a new internship listing?
          </h3>
          <p className="text-xs text-[#1B1B1E]/80">
            A: If you are logged in, navigate to the <Link href="/internships/add" className="text-[#FCA311] font-semibold hover:underline">Add Internship</Link> page in the navigation bar. Fill out all the required details (Title, Company, Workplace Type, Stipend, Category, Short Description, and Image URL) and click "Post Opportunity".
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)] text-base">
            Q: How do I track my submitted applications?
          </h3>
          <p className="text-xs text-[#1B1B1E]/80">
            A: Navigate to your <Link href="/dashboard" className="text-[#FCA311] font-semibold hover:underline">Dashboard</Link> page. Here, you'll find real-time status updates (Applied, Interview, Offer, Rejected) along with a Recharts visualization of your placement progress.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)] text-base">
            Q: Who can I contact for business or support inquiries?
          </h3>
          <p className="text-xs text-[#1B1B1E]/80">
            A: You can reach us directly on our <Link href="/contact" className="text-[#FCA311] font-semibold hover:underline">Contact page</Link> or send an email to <a href="mailto:support@internhive.com" className="text-[#14213D] font-bold hover:underline">support@internhive.com</a>.
          </p>
        </div>

      </div>
    </div>
  );
}
