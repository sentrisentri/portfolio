'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HawkshotRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page with modal parameter
    router.replace('/?modal=hawkshot');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-mono flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-200 mb-4">Loading Hawkshot...</h1>
        <p className="text-slate-400">Redirecting to main page...</p>
      </div>
    </div>
  );
}