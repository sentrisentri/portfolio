'use client';

import React, { useState, useEffect } from 'react';

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold text-slate-200 mb-4">Privacy Policy</h1>
          <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">1. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-slate-200 mb-2">Discord User Data</h3>
                <p className="text-slate-300 leading-relaxed">
                  When you use Hawkshot, we collect and process your Discord user ID, username, and server information to provide bot functionality.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-slate-200 mb-2">Game Data</h3>
                <p className="text-slate-300 leading-relaxed">
                  We collect League of Legends and TFT game data including summoner names, match history, and game statistics through Riot Games API to provide tracking and notification services.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">2. How We Use Your Information</h2>
            <ul className="space-y-2 text-slate-300">
              <li>• Provide game tracking and notification services</li>
              <li>• Display player statistics and match information</li>
              <li>• Send automated Discord messages about game activity</li>
              <li>• Improve bot functionality and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">3. Data Storage and Security</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We store minimal user data necessary for bot functionality. All data is stored securely and encrypted. We do not sell, trade, or share your personal information with third parties.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Game data is retrieved in real-time from Riot Games API and may be temporarily cached to improve performance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">4. Data Retention</h2>
            <p className="text-slate-300 leading-relaxed">
              We retain user data only as long as necessary to provide our services. You can request deletion of your data by contacting us or removing the bot from your server.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">5. Third-Party Services</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-slate-200 mb-2">Riot Games API</h3>
                <p className="text-slate-300 leading-relaxed">
                  We use Riot Games API to fetch game data. This data is subject to Riot Games' privacy policy and terms of service.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-slate-200 mb-2">Discord</h3>
                <p className="text-slate-300 leading-relaxed">
                  Our bot operates on Discord's platform and is subject to Discord's privacy policy and terms of service.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">6. Your Rights</h2>
            <p className="text-slate-300 leading-relaxed mb-4">You have the right to:</p>
            <ul className="space-y-2 text-slate-300">
              <li>• Request access to your personal data</li>
              <li>• Request correction of inaccurate data</li>
              <li>• Request deletion of your data</li>
              <li>• Withdraw consent at any time by removing the bot</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">7. Contact Information</h2>
            <p className="text-slate-300 leading-relaxed">
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us through our Discord support server or by email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">8. Changes to This Policy</h2>
            <p className="text-slate-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify users of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <a href="/" className="inline-flex items-center px-6 py-3 text-sm font-medium text-slate-900 bg-teal-400 rounded-md hover:bg-teal-300 transition-all duration-300 transform hover:scale-105">
            ← Return to Hawkshot
          </a>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700">
          <p className="text-sm text-slate-500 text-center">
            Hawkshot isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
          </p>
        </div>
      </div>
    </div>
  );
}
