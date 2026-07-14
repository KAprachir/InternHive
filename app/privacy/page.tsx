import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 flex flex-col space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-[#1B1B1E] opacity-75">
          Last updated: July 12, 2026
        </p>
      </div>

      <div className="bg-white rounded-[24px] p-8 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50 space-y-6 text-sm text-[#1B1B1E] opacity-90 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
            1. Information We Collect
          </h2>
          <p>
            When you register on InternHive, we collect details such as your name, email address, password hash, and the skills you explicitly list on your profile. For employers, we collect company details and job specifications.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
            2. How We Use Your Information
          </h2>
          <p>
            We use your profile data to calculate your Skill-Match Score against listed internships. Your name and skills are shared with employers when you explicitly apply to their opportunities. We do not sell or lease your personal information to third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
            3. Data Retention and Safety
          </h2>
          <p>
            All user authentication data is securely processed via industry-standard protocols. Profiles and applications are stored securely in our MongoDB instances and are only retained as long as your account remains active.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
            4. Cookie Consent
          </h2>
          <p>
            InternHive utilizes session cookies to track logged-in sessions securely. By using our career platform, you consent to our use of these technical cookies.
          </p>
        </section>
      </div>
    </div>
  );
}
