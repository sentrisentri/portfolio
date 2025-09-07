'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TermsOfService() {
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cursor glow effect
  React.useEffect(() => {
    if (!isClient) return;
    
    // Only enable cursor effect on devices with a mouse
    if (window.matchMedia('(pointer: coarse)').matches) {
      return; // Exit early for touch devices
    }

    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    document.body.appendChild(cursor);

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = e.clientX - 10 + 'px';
      cursor.style.top = e.clientY - 10 + 'px';
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if the element or its parent is clickable
      const isClickable = target.closest('a, button, [role="button"], input, textarea, select') ||
                          target.tagName === 'A' || 
                          target.tagName === 'BUTTON' || 
                          target.classList.contains('hover-glow') ||
                          target.tagName === 'SVG' ||
                          target.closest('svg');
      
      if (isClickable) {
        cursor.classList.add('hover');
      }
    };

    const handleMouseOut = () => {
      cursor.classList.remove('hover');
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor);
      }
    };
  }, [isClient]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-mono">
      <div className="max-w-4xl mx-auto px-6 py-12 md:px-12 md:py-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-200 mb-4">Terms of Service</h1>
          <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              By inviting and using the Hawkshot Discord bot (&quot;the Bot&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the Bot.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">2. Description of Service</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Hawkshot is a Discord bot that provides the following services:
            </p>
            <ul className="space-y-2 text-slate-300">
              <li>• Real-time tracking of League of Legends and TFT games</li>
              <li>• Player statistics and match history display</li>
              <li>• Automated notifications for game activity</li>
              <li>• Game data retrieval through Riot Games API</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">3. User Responsibilities</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-slate-200 mb-2">Appropriate Use</h3>
                <p className="text-slate-300 leading-relaxed">
                  You agree to use the Bot only for its intended purposes and in compliance with Discord&apos;s Terms of Service and Community Guidelines.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-slate-200 mb-2">Prohibited Activities</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Attempting to exploit, hack, or reverse engineer the Bot</li>
                  <li>• Using the Bot to spam or harass other users</li>
                  <li>• Attempting to overwhelm the Bot with excessive requests</li>
                  <li>• Using the Bot for any illegal activities</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">4. Service Availability</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We strive to maintain high availability of the Bot, but we do not guarantee continuous, uninterrupted service. The Bot may be temporarily unavailable due to:
            </p>
            <ul className="space-y-2 text-slate-300">
              <li>• Scheduled maintenance</li>
              <li>• Technical issues or server outages</li>
              <li>• Riot Games API limitations or downtime</li>
              <li>• Discord platform issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">5. Data and Privacy</h2>
            <p className="text-slate-300 leading-relaxed">
              Your use of the Bot is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Bot, you consent to the collection and use of your data as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">6. Disclaimers</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-slate-200 mb-2">Service Accuracy</h3>
                <p className="text-slate-300 leading-relaxed">
                  While we strive for accuracy, we cannot guarantee that all game data and statistics provided by the Bot are completely accurate or up-to-date.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-slate-200 mb-2">Third-Party Dependencies</h3>
                <p className="text-slate-300 leading-relaxed">
                  The Bot relies on third-party services (Riot Games API, Discord) and may be affected by changes or outages to these services.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">7. Limitation of Liability</h2>
            <p className="text-slate-300 leading-relaxed">
              We provide the Bot &quot;as is&quot; without warranties of any kind. We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Bot.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">8. Termination</h2>
            <p className="text-slate-300 leading-relaxed">
              We reserve the right to terminate or suspend access to the Bot at any time, with or without notice, for any reason including violation of these Terms. You may terminate your use of the Bot by removing it from your Discord server.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">9. Changes to Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              We may modify these Terms at any time. Material changes will be communicated through appropriate channels. Continued use of the Bot after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">10. Contact Information</h2>
            <p className="text-slate-300 leading-relaxed">
              If you have any questions about these Terms, please contact us through our Discord support server or by email.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="inline-flex items-center px-6 py-3 text-sm font-medium text-slate-900 bg-teal-400 rounded-md hover:bg-teal-300 transition-all duration-300 transform hover:scale-105">
            ← Return to Hawkshot
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700">
          <p className="text-sm text-slate-500 text-center">
            Hawkshot isn&apos;t endorsed by Riot Games and doesn&apos;t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
          </p>
        </div>
      </div>
    </div>
  );
}
