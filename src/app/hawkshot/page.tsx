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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-teal-400 text-lg">Opening Hawkshot...</div>
    </div>
  );
}