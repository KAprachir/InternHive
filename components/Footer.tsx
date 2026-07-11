import React from 'react';
import Link from 'next/link';

/**
 * Footer Component.
 * Static global footer presenting brand description, page directory, contact, and social anchors.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#14213D] text-white border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Intern<span className="text-[#FCA311]">Hive</span>
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Connecting the next generation of Bangladeshi talents with industry leaders. Finding entry-level roles and internships has never been easier.
            </p>
            <div className="flex space-x-4">
              {/* Mock Social Links */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FCA311] transition duration-200">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FCA311] transition duration-200">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FCA311] transition duration-200">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
            </div>
          </div>

          {/* Site Directory Col */}
          <div>
            <h4 className="text-md font-semibold text-white mb-4 tracking-wider uppercase font-[family-name:var(--font-space-grotesk)]">
              Sitemap
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-300 hover:text-[#FCA311] transition duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/internships" className="text-sm text-gray-300 hover:text-[#FCA311] transition duration-200">
                  Search Internships
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-300 hover:text-[#FCA311] transition duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-300 hover:text-[#FCA311] transition duration-200">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Resources Col */}
          <div>
            <h4 className="text-md font-semibold text-white mb-4 tracking-wider uppercase font-[family-name:var(--font-space-grotesk)]">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-gray-300 cursor-not-allowed hover:text-gray-400">
                  Help Center
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-300 cursor-not-allowed hover:text-gray-400">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-300 cursor-not-allowed hover:text-gray-400">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-300 cursor-not-allowed hover:text-gray-400">
                  Employer Portal
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-md font-semibold text-white mb-4 tracking-wider uppercase font-[family-name:var(--font-space-grotesk)]">
              Contact Info
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start">
                <span className="font-semibold text-white mr-2">Email:</span>
                <a href="mailto:support@internhive.com" className="hover:text-[#FCA311] transition duration-200">
                  support@internhive.com
                </a>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-white mr-2">Phone:</span>
                <span>+880 1712-345678</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-white mr-2">Office:</span>
                <span className="leading-relaxed">
                  Level 8, Software Technology Park, Karwan Bazar, Dhaka 1215
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-400 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>&copy; {currentYear} InternHive. All rights reserved. Built for Assignment Purposes.</p>
          <p className="flex space-x-4">
            <span className="hover:text-white transition cursor-pointer">Security Guidelines</span>
            <span>&bull;</span>
            <span className="hover:text-white transition cursor-pointer">SLA Agreement</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
