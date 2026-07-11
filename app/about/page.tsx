import React from 'react';

/**
 * AboutUsPage Component.
 * Static informational page describing InternHive's mission, values, and team.
 */
export default function AboutUsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 flex flex-col space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
          About InternHive
        </h1>
        <p className="text-sm sm:text-base text-[#1B1B1E] opacity-75 max-w-xl mx-auto leading-relaxed">
          Connecting university students and high-growth companies in Bangladesh through technology and data-matching.
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[24px] p-8 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50 space-y-4">
          <div className="text-2xl bg-[#F5F3F6] w-12 h-12 rounded-xl flex items-center justify-center">🎯</div>
          <h2 className="text-lg font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]"> Our Mission</h2>
          <p className="text-xs text-[#1B1B1E] opacity-80 leading-relaxed">
            To empower young professionals in Bangladesh by simplifying the internship discovery process. We aim to replace manual, disorganized applications with a dynamic, skill-oriented matching platform.
          </p>
        </div>

        <div className="bg-white rounded-[24px] p-8 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50 space-y-4">
          <div className="text-2xl bg-[#F5F3F6] w-12 h-12 rounded-xl flex items-center justify-center">⚡</div>
          <h2 className="text-lg font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">Our Vision</h2>
          <p className="text-xs text-[#1B1B1E] opacity-80 leading-relaxed">
            To become the leading talent hub in South Asia, enabling employers to source pre-validated skills instantly and allowing students to transition from academia to careers seamlessly.
          </p>
        </div>
      </div>

      {/* Key Highlights */}
      <div className="bg-white rounded-[24px] p-8 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50 space-y-6">
        <h2 className="text-xl font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)] border-b border-gray-100 pb-3 text-center md:text-left">
          Why Students Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="space-y-2">
            <span className="text-xl font-semibold text-[#FCA311]">📊 Skill-Match % Score</span>
            <p className="text-xs text-[#1B1B1E] opacity-75 leading-relaxed">
              We calculate how well your skills match listed requirements, so you apply to roles where you have the highest chance of placement.
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-xl font-semibold text-[#FCA311]">🎯 Verified Placements</span>
            <p className="text-xs text-[#1B1B1E] opacity-75 leading-relaxed">
              All listed internship positions undergo internal verification checks, assuring students of real, active roles.
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-xl font-semibold text-[#FCA311]">⚙️ Real-time Tracking</span>
            <p className="text-xs text-[#1B1B1E] opacity-75 leading-relaxed">
              Ditch the anxiety of sending emails into the void. Monitor your application status in real-time on your dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Core Team Section */}
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
          Meet the Founders
        </h2>
        <p className="text-xs text-[#1B1B1E] opacity-75 max-w-sm mx-auto">
          Passionate engineers and educators working to build a stronger tech ecosystem in Bangladesh.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 max-w-2xl mx-auto">
          {/* Member 1 */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50 space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#14213D] text-white flex items-center justify-center text-xl font-bold mx-auto font-[family-name:var(--font-space-grotesk)]">
              AI
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">Anisul Islam</h4>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Co-Founder & CEO</p>
            </div>
            <p className="text-xs text-[#1B1B1E] opacity-75 leading-relaxed">
              Former software architect and university lecturer with over 10 years of experience in mentorship and tech recruitment.
            </p>
          </div>

          {/* Member 2 */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50 space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#FCA311] text-white flex items-center justify-center text-xl font-bold mx-auto font-[family-name:var(--font-space-grotesk)]">
              TR
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">Tasnim Rahman</h4>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Co-Founder & CTO</p>
            </div>
            <p className="text-xs text-[#1B1B1E] opacity-75 leading-relaxed">
              Full-stack engineer passionate about scalable web architectures, caching systems, and student career mentoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
