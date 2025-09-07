'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [showHawkshotModal, setShowHawkshotModal] = useState(false);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for hawkshot route and URL parameters
  useEffect(() => {
    if (!isClient) return;
    
    // Check if we should open the modal based on URL search parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('modal') === 'hawkshot') {
      setShowHawkshotModal(true);
      // Clean up the URL without the search parameter
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('modal');
      window.history.replaceState({}, '', cleanUrl.pathname);
    }

    // Handle browser back/forward buttons
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.hawkshotModal) {
        setShowHawkshotModal(true);
      } else {
        setShowHawkshotModal(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isClient]);

  // Function to open modal and update URL
  const openHawkshotModal = () => {
    setShowHawkshotModal(true);
    window.history.pushState({ hawkshotModal: true }, '', '/hawkshot');
  };

  // Function to close modal and update URL
  const closeHawkshotModal = () => {
    setIsClosingModal(true);
    setTimeout(() => {
      setShowHawkshotModal(false);
      setIsClosingModal(false);
      window.history.pushState({}, '', '/');
    }, 200); // Match the animation duration
  };

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
      const element = e.target as HTMLElement;
      // Check if the element or its parent is clickable or scrollable
      const isClickable = element.closest('a, button, [role="button"], input, textarea, select') ||
                          element.tagName === 'A' || 
                          element.tagName === 'BUTTON' || 
                          element.classList.contains('hover-glow') ||
                          element.tagName === 'SVG' ||
                          element.closest('svg');
      
      // Check if we're over a scrollable area
      const isScrollable = element.closest('.modal-scrollbar') ||
                           element.classList.contains('modal-scrollbar') ||
                           getComputedStyle(element).overflowY === 'auto' ||
                           getComputedStyle(element).overflowY === 'scroll';
      
      if (isClickable || isScrollable) {
        cursor.classList.add('hover');
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement;
      
      // Don't remove hover if we're still within a scrollable area
      if (relatedTarget && relatedTarget.closest('.modal-scrollbar')) {
        return;
      }
      
      cursor.classList.remove('hover');
    };

    // Add mouse leave handler for the entire modal to ensure cursor resets
    const handleModalMouseLeave = () => {
      cursor.classList.remove('hover');
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    
    // Add event listener for modal container
    const modalElements = document.querySelectorAll('.modal-scrollbar');
    modalElements.forEach(modal => {
      modal.addEventListener('mouseleave', handleModalMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      modalElements.forEach(modal => {
        modal.removeEventListener('mouseleave', handleModalMouseLeave);
      });
      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor);
      }
    };
  }, [isClient]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-mono">
      <div className="lg:flex lg:justify-between lg:gap-4 mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
        
        {/* Left Side - Fixed Header */}
        <div className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
              Kirubel Mulat
            </h1>
            <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">
              Student Software Engineer
            </h2>
            <p className="mt-4 max-w-xs leading-normal">
              I build software solutions and digital experiences across various platforms.
            </p>
            
            {/* Navigation */}
            <nav className="nav hidden lg:block" aria-label="In-page jump links">
              <ul className="mt-16 w-max">
                <li>
                  <a className="group flex items-center py-3 active" href="#about">
                    <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none"></span>
                    <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200">
                      About
                    </span>
                  </a>
                </li>
                <li>
                  <a className="group flex items-center py-3" href="#education">
                    <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none"></span>
                    <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200">
                      Education
                    </span>
                  </a>
                </li>
                <li>
                  <a className="group flex items-center py-3" href="#projects">
                    <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none"></span>
                    <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200">
                      Personal Projects
                    </span>
                  </a>
                </li>
                <li>
                  <a className="group flex items-center py-3" href="#university-projects">
                    <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none"></span>
                    <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200">
                      University Projects
                    </span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          
          {/* Social Links */}
          <ul className="ml-1 mt-8 flex items-center" aria-label="Social media">
            <li className="mr-5 text-xs shrink-0">
              <a className="block hover:text-slate-200" href="https://github.com/sentrisentri" target="_blank" rel="noreferrer noopener" aria-label="GitHub (opens in a new tab)" title="GitHub">
                <span className="sr-only">GitHub</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-6 w-6" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
              </a>
            </li>
            <li className="mr-5 text-xs shrink-0">
              <a className="block hover:text-slate-200" href="https://x.com/sentrisentri" target="_blank" rel="noreferrer noopener" aria-label="Twitter/X (opens in a new tab)" title="Twitter/X">
                <span className="sr-only">Twitter/X</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
            </li>
            <li className="mr-5 text-xs shrink-0">
              <a className="block hover:text-slate-200" href="mailto:kirubel.mulat@gmail.com" aria-label="Email" title="Email">
                <span className="sr-only">Email</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"></path>
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"></path>
                </svg>
              </a>
            </li>
          </ul>
        </div>

        {/* Right Side - Scrollable Content */}
        <main className="pt-24 lg:w-1/2 lg:py-24">
          
          {/* About Section */}
          <section id="about" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="About me">
            <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">About</h2>
            </div>
            <div>
              <p className="mb-4">
                I&apos;m a 2nd year Software Development student at Bournemouth University. I spend most of my time building things for the web and learning new technologies. When I&apos;m not studying, I&apos;m usually working on side projects or figuring out how to make Discord bots do interesting things.
              </p>
              <p className="mb-4">
                My journey in software development has already led me to work on diverse projects, including developing a website for a client and creating two personal projects that showcase my growing skills in web development and software engineering. I enjoy the challenge of turning ideas into functional, user-friendly applications.
              </p>
              <p>
                When I&apos;m not coding for university or client work, I&apos;m usually exploring new technologies, contributing to personal projects, or learning about emerging trends in software development and web technologies.
              </p>
            </div>
          </section>

          {/* Education Section */}
          <section id="education" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Education">
            <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">Education</h2>
            </div>
            <div>
              <ol className="group/list">
                
                {/* Education Item 1 */}
                <li className="mb-12">
                  <div className="group relative">
                    <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
                    <div className="relative z-10 pb-1 transition-all lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                      <header className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500" aria-label="2023 to Current">
                        2023 — Current
                      </header>
                      <h3 className="font-medium leading-snug text-slate-200">
                        <div>
                          <a className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-teal-300 focus-visible:text-teal-300 group/link text-base" href="#" target="_blank" rel="noreferrer noopener" aria-label="Software Engineering BSc at Bournemouth University (opens in a new tab)">
                            <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                            <span>Software Engineering BSc · Bournemouth University</span>
                          </a>
                        </div>
                      </h3>
                      <p className="mt-2 text-sm leading-normal">
                        Currently pursuing a comprehensive degree in software engineering with focus on modern development practices, software architecture, and industry-standard technologies. Gaining hands-on experience through practical projects and collaborative development.
                      </p>
                      <ul className="mt-2 flex flex-wrap" aria-label="Relevant coursework">
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">Software Engineering</div>
                        </li>
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">Programming</div>
                        </li>
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">System Design</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>

                {/* Education Item 2 */}
                <li className="mb-12">
                  <div className="group relative">
                    <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
                    <div className="relative z-10 pb-1 transition-all lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                      <header className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500" aria-label="2021 to 2023">
                        2021 — 2023
                      </header>
                      <h3 className="font-medium leading-snug text-slate-200">
                        <div>
                          <span className="inline-flex items-baseline font-medium leading-tight text-slate-200 text-base">
                            A-Levels · Coopers School
                          </span>
                        </div>
                      </h3>
                      <p className="mt-2 text-sm leading-normal">
                        Completed A-Level studies with a focus on Computer Science and Photography. Developed strong analytical and creative skills while building a foundation in programming and digital media creation.
                      </p>
                      <ul className="mt-2 flex flex-wrap" aria-label="Key subjects">
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">Computer Science</div>
                        </li>
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">Photography</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Personal Projects Section */}
          <section id="projects" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Selected personal projects">
            <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">Personal Projects</h2>
            </div>
            <div>
              <ul className="group/list">
                
                {/* Project 1 - Hawkshot */}
                <li className="mb-12">
                  <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                    <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
                    <div className="z-10 order-1 sm:order-2 sm:col-span-6">
                      <h3>
                        <button className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-teal-300 focus-visible:text-teal-300 group/link text-base cursor-pointer" onClick={openHawkshotModal} aria-label="View Hawkshot Discord Bot details">
                          <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                          <span>Hawkshot</span>
                          <span className="inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px" aria-hidden="true">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                            </svg>
                          </span>
                        </button>
                      </h3>
                      <p className="mt-2 text-sm leading-normal">A Discord bot that tracks League of Legends and soon VALORANT games and sends them to a server. Provides real-time game tracking and match notifications for gaming communities. <span className="text-teal-300">Click to view details and invite!</span></p>
                      <ul className="mt-2 flex flex-wrap" aria-label="Technologies used:">
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">Discord Bot</div>
                        </li>
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">League of Legends API</div>
                        </li>
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">VALORANT API</div>
                        </li>
                      </ul>
                    </div>
                    <div className="z-10 order-0 sm:order-1 sm:col-span-2 mb-4 sm:mb-0">
                      <div className="rounded border-2 border-slate-200/10 transition group-hover:border-slate-200/30 sm:order-1 sm:col-span-2 sm:translate-y-1">
                        <Image src="/Ashe_Hawkshot.webp" alt="Hawkshot Discord Bot" width={256} height={64} className="h-16 w-full object-cover rounded" />
                      </div>
                    </div>
                  </div>
                </li>

                {/* Project 2 - Honkai.me */}
                <li className="mb-12">
                  <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                    <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
                    <div className="z-10 order-1 sm:order-2 sm:col-span-6">
                      <h3>
                        <a className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-teal-300 focus-visible:text-teal-300 group/link text-base" href="https://honkai.me" target="_blank" rel="noreferrer noopener" aria-label="Honkai.me Website (opens in a new tab)">
                          <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                          <span>Honkai.me</span>
                          <span className="inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px" aria-hidden="true">
                              <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd"></path>
                            </svg>
                          </span>
                        </a>
                      </h3>
                      <p className="mt-2 text-sm leading-normal">A website committed to Honkai Impact 3rd&apos;s Characters, Weapons and Meta. Comprehensive resource for game information and community guides.</p>
                      <ul className="mt-2 flex flex-wrap" aria-label="Technologies used:">
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">Web Development</div>
                        </li>
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">Game Database</div>
                        </li>
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">Community Platform</div>
                        </li>
                      </ul>
                    </div>
                    <div className="z-10 order-0 sm:order-1 sm:col-span-2 mb-4 sm:mb-0">
                      <div className="rounded border-2 border-slate-200/10 transition group-hover:border-slate-200/30 sm:order-1 sm:col-span-2 sm:translate-y-1">
                        <Image src="/honkaime.png" alt="Honkai.me Website" width={256} height={64} className="h-16 w-full object-cover rounded" />
                      </div>
                    </div>
                  </div>
                </li>

                {/* Project 3 - D.London */}
                <li className="mb-12">
                  <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                    <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
                    <div className="z-10 order-1 sm:order-2 sm:col-span-6">
                      <h3>
                        <a className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-teal-300 focus-visible:text-teal-300 group/link text-base" href="https://d-london.com" target="_blank" rel="noreferrer noopener" aria-label="D.London Fashion Website (opens in a new tab)">
                          <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                          <span>D.London</span>
                          <span className="inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px" aria-hidden="true">
                              <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd"></path>
                            </svg>
                          </span>
                        </a>
                      </h3>
                      <p className="mt-2 text-sm leading-normal">A modern, responsive website for D London - an Ethiopian fashion brand that creates beautiful dresses combining traditional Ethiopian prints with Western European style.</p>
                      <ul className="mt-2 flex flex-wrap" aria-label="Technologies used:">
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">Client Work</div>
                        </li>
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">Responsive Design</div>
                        </li>
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">Fashion E-commerce</div>
                        </li>
                      </ul>
                    </div>
                    <div className="z-10 order-0 sm:order-1 sm:col-span-2 mb-4 sm:mb-0">
                      <div className="rounded border-2 border-slate-200/10 transition group-hover:border-slate-200/30 sm:order-1 sm:col-span-2 sm:translate-y-1">
                        <div className="h-16 w-full bg-white rounded flex items-center justify-center p-2">
                          <Image src="/D-London-blacksolologo.webp" alt="D.London Fashion Brand Logo" width={256} height={64} className="h-full w-auto object-contain" />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* University Projects Section */}
          <section id="university-projects" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="University projects">
            <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">University Projects</h2>
            </div>
            <div>
              <ul className="group/list">
                
                {/* University Project 1 - Trikommerce */}
                <li className="mb-12">
                  <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                    <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
                    <div className="z-10 sm:col-span-8">
                      <h3 className="font-medium leading-snug text-slate-200">
                        <div>
                          <a className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-teal-300 focus-visible:text-teal-300 group/link text-base" href="https://github.com/sentrisentri/Trikommerce-Project" target="_blank" rel="noreferrer noopener" aria-label="Trikommerce Project (opens in a new tab)">
                            <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                            <span>Trikommerce Project</span>
                            <span className="inline-block">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd"></path>
                              </svg>
                            </span>
                          </a>
                        </div>
                      </h3>
                      <p className="mt-2 text-sm leading-normal">A Python-based e-commerce application developed as part of university coursework. This project demonstrates understanding of object-oriented programming principles, data structures, and software engineering practices.</p>
                      <ul className="mt-2 flex flex-wrap" aria-label="Technologies used:">
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">Python</div>
                        </li>
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">Object-Oriented Programming</div>
                        </li>
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">University Project</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>

                {/* University Project 2 - Contacts */}
                <li className="mb-12">
                  <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                    <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
                    <div className="z-10 sm:col-span-8">
                      <h3 className="font-medium leading-snug text-slate-200">
                        <div>
                          <a className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-teal-300 focus-visible:text-teal-300 group/link text-base" href="https://github.com/sentrisentri/contacts" target="_blank" rel="noreferrer noopener" aria-label="Contacts Project (opens in a new tab)">
                            <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                            <span>Contacts Management System</span>
                            <span className="inline-block">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd"></path>
                              </svg>
                            </span>
                          </a>
                        </div>
                      </h3>
                      <p className="mt-2 text-sm leading-normal">A Python application for managing contact information. Features include adding, editing, deleting, and searching contacts with data persistence and user-friendly interface design.</p>
                      <ul className="mt-2 flex flex-wrap" aria-label="Technologies used:">
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">Python</div>
                        </li>
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">Data Management</div>
                        </li>
                        <li className="mr-1.5 mt-2">
                          <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">University Project</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Footer */}
          <footer className="max-w-md pb-16 text-sm text-slate-500 sm:pb-0">
            <p>
              Built with <a href="https://nextjs.org/" className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300" target="_blank" rel="noreferrer noopener" aria-label="Next.js (opens in a new tab)">Next.js</a> and <a href="https://tailwindcss.com/" className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300" target="_blank" rel="noreferrer noopener" aria-label="Tailwind CSS (opens in a new tab)">Tailwind CSS</a>, deployed with <a href="https://vercel.com/" className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300" target="_blank" rel="noreferrer noopener" aria-label="Vercel (opens in a new tab)">Vercel</a>.
            </p>
          </footer>
        </main>
      </div>

      {/* Hawkshot Modal */}
      {showHawkshotModal && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${isClosingModal ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={closeHawkshotModal}>
          <div className={`bg-slate-800 rounded-lg p-4 sm:p-8 max-w-md sm:max-w-2xl w-full mx-4 border border-slate-700 max-h-[90vh] overflow-y-auto modal-scrollbar ${isClosingModal ? 'animate-scale-out' : 'animate-scale-in'}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <Image src="/Ashe_Hawkshot.webp" alt="Hawkshot Bot" width={40} height={40} className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full border-2 border-slate-600" />
                <h2 className="text-lg sm:text-2xl font-bold text-slate-200">Hawkshot Discord Bot</h2>
              </div>
              <button 
                onClick={closeHawkshotModal}
                className="text-slate-400 hover:text-slate-200 text-xl sm:text-2xl transition-colors"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4 sm:mb-6">
              <p className="text-slate-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Track your League of Legends and VALORANT games automatically! Hawkshot sends real-time match notifications and game stats directly to your Discord server, keeping your community engaged with live game updates.
              </p>
              
              <div className="mb-4 sm:mb-6">
                <h3 className="text-slate-200 font-semibold mb-2 sm:mb-3 text-base sm:text-lg">Features:</h3>
                <ul className="text-slate-300 space-y-1 sm:space-y-2 text-sm sm:text-base">
                  <li className="flex items-center">
                    <span className="text-teal-400 mr-2 sm:mr-3">•</span>
                    Real-time game tracking and notifications
                  </li>
                  <li className="flex items-center">
                    <span className="text-teal-400 mr-2 sm:mr-3">•</span>
                    League of Legends match integration
                  </li>
                  <li className="flex items-center">
                    <span className="text-teal-400 mr-2 sm:mr-3">•</span>
                    VALORANT support (coming soon)
                  </li>
                  <li className="flex items-center">
                    <span className="text-teal-400 mr-2 sm:mr-3">•</span>
                    Customizable server notifications
                  </li>
                </ul>
              </div>
              
              {/* Watch Command Section */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-slate-200 font-semibold mb-2 sm:mb-3 text-base sm:text-lg">Watch Command:</h3>
                <p className="text-slate-300 text-sm sm:text-base mb-3">
                  Use <code className="bg-slate-700 px-2 py-1 rounded text-teal-300">/watch</code> to automatically track and get notified when players start or finish their League of Legends and TFT games.
                </p>
                <div className="bg-slate-700 rounded-lg p-3 border border-slate-600 max-w-md mx-auto">
                  <Image src="/watch.png" alt="Hawkshot Watch Command Example" width={400} height={300} className="w-full rounded border border-slate-600" />
                </div>
              </div>
              
              {/* Profile Command Section */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-slate-200 font-semibold mb-2 sm:mb-3 text-base sm:text-lg">Profile Command:</h3>
                <p className="text-slate-300 text-sm sm:text-base mb-3">
                  Use <code className="bg-slate-700 px-2 py-1 rounded text-teal-300">/profile</code> to view detailed League of Legends statistics and match history.
                </p>
                <div className="bg-slate-700 rounded-lg p-3 border border-slate-600 max-w-md mx-auto">
                  <Image src="/hawkshotprofile.png" alt="Hawkshot Profile Command Example" width={400} height={300} className="w-full rounded border border-slate-600" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a 
                href="https://discord.com/oauth2/authorize?client_id=1066088023227375646" 
                target="_blank" 
                rel="noreferrer noopener"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded font-medium text-center transition-colors text-sm sm:text-base"
              >
                Invite to Server
              </a>
              <button 
                onClick={closeHawkshotModal}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 sm:py-3 px-4 sm:px-6 rounded font-medium transition-colors text-sm sm:text-base"
              >
                Close
              </button>
            </div>
            
            {/* Legal Section */}
            <div className="mt-6 pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-400 text-center">
                By inviting this bot, you agree to our{' '}
                <a 
                  href="/privacy-policy" 
                  target="_blank" 
                  rel="noreferrer noopener"
                  className="text-teal-400 hover:text-teal-300 underline"
                >
                  Privacy Policy
                </a>
                {' '}and{' '}
                <a 
                  href="/terms-of-service" 
                  target="_blank" 
                  rel="noreferrer noopener"
                  className="text-teal-400 hover:text-teal-300 underline"
                >
                  Terms of Service
                </a>
              </p>
              
              {/* Riot Games Disclaimer */}
              <p className="text-xs text-slate-500 text-center mt-4 leading-relaxed">
                Hawkshot isn&apos;t endorsed by Riot Games and doesn&apos;t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
