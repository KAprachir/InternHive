import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 flex flex-col space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-[#1B1B1E] opacity-75">
          Last updated: July 12, 2026
        </p>
      </div>

      <div className="bg-white rounded-[24px] p-8 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50 space-y-6 text-sm text-[#1B1B1E] opacity-90 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
            1. User Acceptance
          </h2>
          <p>
            By creating an account on InternHive, you agree to comply with our academic assignment guidelines and terms of service. You represent that you are a university student or corporate representative posting valid opportunities.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
            2. Code of Conduct
          </h2>
          <p>
            You agree not to list deceptive, fraudulent, or non-educational listings. You also agree not to bypass security configurations, spoof headers, or submit malicious payloads to the backend application database.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
            3. Account Responsibilities
          </h2>
          <p>
            You are responsible for keeping your login credentials confidential. Any application submitted or listing created through your authenticated session cookie is considered authorized by you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
            4. Limitation of Liability
          </h2>
          <p>
            InternHive is an educational assignment platform linking students with corporate roles. We do not guarantee student placements or verify corporate entities beyond basic platform requirements.
          </p>
        </section>
      </div>
    </div>
  );
}
