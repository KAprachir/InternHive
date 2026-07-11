'use client';

import React, { useState } from 'react';

/**
 * ContactPage Component.
 * Form allowing candidates and employers to contact support.
 */
export default function ContactPage() {
  // Form input states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<string>('');

  /**
   * Action handler for form submission.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    // Simulate sending message
    setTimeout(() => {
      setSuccess('Your message has been sent successfully! Our team will get back to you within 24 hours.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 flex flex-col space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14213D] font-[family-name:var(--font-space-grotesk)]">
          Get in Touch
        </h1>
        <p className="text-sm text-[#1B1B1E] opacity-75 max-w-sm mx-auto">
          Have questions, feedback, or need help with recruitment? Send us a message below!
        </p>
      </div>

      {/* Grid: Details (left), Form (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Details Card (Col Span 1) */}
        <div className="bg-[#14213D] text-white rounded-[24px] p-8 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-navy-800 flex flex-col justify-between space-y-8">
          <div>
            <h3 className="text-xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)] mb-4">
              Contact Information
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-8">
              Reach out to our corporate headquarters or send support questions directly to our email. We are here to assist you.
            </p>

            <ul className="space-y-6 text-xs text-gray-300">
              <li className="flex items-start">
                <span className="font-semibold text-white mr-3">Office:</span>
                <span className="leading-relaxed">
                  Level 8, Software Technology Park, Karwan Bazar, Dhaka 1215
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-white mr-3">Email:</span>
                <a href="mailto:support@internhive.com" className="hover:text-[#FCA311] transition duration-200">
                  support@internhive.com
                </a>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-white mr-3">Phone:</span>
                <span>+880 1712-345678</span>
              </li>
            </ul>
          </div>

          <p className="text-[10px] text-gray-400">
            Corporate Business hours: Sunday - Thursday, 9:00 AM - 6:00 PM.
          </p>
        </div>

        {/* Message Form (Col Span 2) */}
        <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-[0px_4px_20px_rgba(20,33,61,0.03)] border border-gray-100/50 lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-xs">
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-[#1B1B1E] mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#1B1B1E] mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
                />
              </div>

              {/* Subject */}
              <div className="sm:col-span-2">
                <label htmlFor="subject" className="block text-sm font-semibold text-[#1B1B1E] mb-1">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
                  placeholder="How can we help you?"
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200"
                />
              </div>

              {/* Message */}
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-semibold text-[#1B1B1E] mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                  placeholder="Write your message details here..."
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D] focus:ring-opacity-10 transition duration-200 resize-y"
                />
              </div>

            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3.5 bg-[#14213D] text-white text-sm font-semibold rounded-xl hover:bg-opacity-95 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
