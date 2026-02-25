'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function MudaeToolsLandingPage() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    document.body.appendChild(cursor);

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = e.clientX - 10 + 'px';
      cursor.style.top = e.clientY - 10 + 'px';
    };

    const handleMouseOver = (e: MouseEvent) => {
      const element = e.target as HTMLElement;
      const isClickable = element.closest('a, button, [role="button"], input, textarea, select') ||
        element.tagName === 'A' ||
        element.tagName === 'BUTTON' ||
        element.classList.contains('hover-glow') ||
        element.tagName === 'SVG' ||
        element.closest('svg');

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
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-black px-6 py-16 text-slate-300 font-sans animate-fade-in sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl animate-blob"></div>
      <div className="pointer-events-none absolute top-24 right-0 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl animate-blob animation-delay-2000"></div>

      <div className="relative mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-teal-300/60 hover:text-teal-300"
        >
          <span aria-hidden="true">←</span>
          Back to portfolio
        </Link>

        <p className="mt-8 text-sm font-medium uppercase tracking-[0.2em] text-teal-300">Mudae Tools</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Everything for your Mudae workflow in one place
        </h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          Use the gallery today and get ready for sorter-focused ranking tools soon. This hub is where both tools will live.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 shadow-lg backdrop-blur-sm">
            <div>
              <h2 className="text-xl font-semibold text-white">Mudae Sorter</h2>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Rank and organize your Mudae collection with custom sorting workflows, filters, and export options.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>• Tier and priority ranking</li>
              <li>• Collection-based filtering</li>
              <li>• Planned import/export support</li>
            </ul>
            <Link
              href="/mudae-tools/sorter"
              className="mt-6 inline-flex items-center rounded-md border border-slate-500 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-teal-300/60 hover:text-teal-300"
            >
              Open sorter
            </Link>
          </div>

          <div className="rounded-2xl border border-teal-500/30 bg-slate-800/60 p-6 shadow-lg backdrop-blur-sm">
            <div>
              <h2 className="text-xl font-semibold text-white">Mudae Gallery</h2>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              View and present your characters with the existing gallery experience and a focus-first carousel.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>• Fast paste-to-load workflow</li>
              <li>• Dynamic background themes</li>
              <li>• Clean presentation layout</li>
            </ul>
            <Link
              href="/mudae-tools/gallery"
              className="mt-6 inline-flex items-center rounded-md bg-teal-400/10 px-4 py-2 text-sm font-medium text-teal-300 transition hover:bg-teal-400/20"
            >
              Open gallery
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
