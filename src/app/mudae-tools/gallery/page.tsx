"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

type Collection = {
  id: string;
  name: string;
  imageUrl?: string;
};

export default function MudaeToolsPage() {
  const [rawInput, setRawInput] = useState('');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [carouselAnchorIndex, setCarouselAnchorIndex] = useState(0);
  const [carouselShift, setCarouselShift] = useState(0);
  const [isCarouselAnimating, setIsCarouselAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [backgroundStyle, setBackgroundStyle] = useState('bg-slate-900');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [adaptiveColor, setAdaptiveColor] = useState<string | null>(null);
  const slideTimeoutRef = useRef<number | null>(null);
  const carouselTimeoutRef = useRef<number | null>(null);
  const mainImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.matchMedia('(pointer: coarse)').matches) {
      return; // Skip custom cursor on touch devices
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

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const parsedPreview = useMemo(() => {
    if (!rawInput.trim()) return [] as Collection[];

    return rawInput
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const match = line.match(/^(.*?)\s*-\s*(https?:\/\/\S+)$/);
        if (!match) return null;

        const name = match[1]?.trim();
        const imageUrl = match[2]?.trim();
        if (!name || !imageUrl) return null;

        return { id: `p-${index}`, name, imageUrl } as Collection;
      })
      .filter((entry): entry is Collection => Boolean(entry));
  }, [rawInput]);

  const handleApply = () => {
    setCollections(parsedPreview);
    setSelectedIndex(0);
    setCarouselAnchorIndex(0);
    setCarouselShift(0);
  };

  const handleClear = () => {
    setRawInput('');
    setCollections([]);
    setSelectedIndex(0);
    setCarouselAnchorIndex(0);
    setCarouselShift(0);
  };

  const setIndexWithAnimation = (nextIndex: number, direction: 'left' | 'right') => {
    setSlideDirection(direction);
    setSelectedIndex(nextIndex);

    if (slideTimeoutRef.current) {
      window.clearTimeout(slideTimeoutRef.current);
    }

    slideTimeoutRef.current = window.setTimeout(() => {
      setSlideDirection(null);
    }, 320);
  };

  const hasLoaded = collections.length > 0;
  const selectedCharacter = collections[selectedIndex];

  const carouselWindow = useMemo(() => {
    if (!collections.length) return [] as Array<{ item: Collection; index: number }>;

    const windowSize = 11;
    const half = Math.floor(windowSize / 2);
    const items: Array<{ item: Collection; index: number }> = [];

    for (let offset = -half; offset <= half; offset += 1) {
      const index = (carouselAnchorIndex + offset + collections.length) % collections.length;
      items.push({ item: collections[index], index });
    }

    return items;
  }, [collections, carouselAnchorIndex]);

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return undefined;
    return `/api/image?url=${encodeURIComponent(imageUrl)}`;
  };

  const collectionUrlsKey = useMemo(
    () => collections.map((collection) => collection.imageUrl ?? '').join('|'),
    [collections]
  );

  const backgroundClass = backgroundStyle === 'adaptive' ? '' : backgroundStyle;
  const adaptiveStyle = backgroundStyle === 'adaptive' && adaptiveColor
    ? { backgroundColor: adaptiveColor }
    : undefined;

  const extractAverageColor = (image: HTMLImageElement) => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return null;

      const size = 32;
      canvas.width = size;
      canvas.height = size;
      context.drawImage(image, 0, 0, size, size);

      const data = context.getImageData(0, 0, size, size).data;
      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;

      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count += 1;
      }

      if (!count) return null;
      const factor = 0.35;
      const avgR = Math.round((r / count) * factor);
      const avgG = Math.round((g / count) * factor);
      const avgB = Math.round((b / count) * factor);

      return `rgb(${avgR}, ${avgG}, ${avgB})`;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!collections.length) return;

    collections.forEach((collection) => {
      if (!collection.imageUrl) return;
      const preloadImage = new Image();
      preloadImage.src = getImageUrl(collection.imageUrl) ?? '';
    });
  }, [collectionUrlsKey]);

  useEffect(() => {
    if (backgroundStyle !== 'adaptive') {
      setAdaptiveColor(null);
      return;
    }

    if (!selectedCharacter?.imageUrl) {
      setAdaptiveColor(null);
      return;
    }

    const imageElement = mainImageRef.current;
    const isGif = /\.gif(\?|$)/i.test(selectedCharacter.imageUrl);

    const updateColor = () => {
      if (!imageElement || !imageElement.complete) return;
      const color = extractAverageColor(imageElement);
      if (color) {
        setAdaptiveColor(color);
      }
    };

    updateColor();

    if (isGif) {
      const intervalId = window.setInterval(updateColor, 500);
      return () => window.clearInterval(intervalId);
    }

    return undefined;
  }, [backgroundStyle, selectedCharacter?.imageUrl]);

  const animateCarouselToIndex = (nextIndex: number, delta: number) => {
    if (!collections.length || delta === 0) return;

    setIndexWithAnimation(nextIndex, delta > 0 ? 'left' : 'right');
    setCarouselAnchorIndex(nextIndex);
    setCarouselShift(-delta);
    setIsCarouselAnimating(true);

    if (carouselTimeoutRef.current) {
      window.clearTimeout(carouselTimeoutRef.current);
    }

    window.requestAnimationFrame(() => {
      setCarouselShift(0);
    });

    carouselTimeoutRef.current = window.setTimeout(() => {
      setIsCarouselAnimating(false);
    }, 320);
  };

  const handleFullscreenToggle = async () => {
    if (typeof document === 'undefined') return;

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore fullscreen errors (permissions or unsupported)
    }
  };

  return (
    <div
      className={`min-h-screen text-slate-300 font-sans animate-fade-in ${backgroundClass} bg-[radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.85),transparent_60%)]`}
      style={adaptiveStyle}
    >
      <div className={`mx-auto flex min-h-screen w-full max-w-6xl flex-col px-1 ${isFullscreen ? 'py-2' : 'py-16'} md:px-2 lg:px-2`}>
        <div className={`flex flex-wrap items-center justify-between gap-4 ${isFullscreen ? 'mb-2' : 'mb-10'}`}>
          {!isFullscreen && (
            <Link className="inline-flex items-center text-sm font-medium text-teal-300 hover:text-teal-200" href="/">
              <span className="mr-2">←</span>
              Back to home
            </Link>
          )}
          {hasLoaded && !isFullscreen && (
            <button
              type="button"
              className="rounded-full border border-slate-200/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-slate-200/40"
              onClick={handleFullscreenToggle}
            >
              Fullscreen
            </button>
          )}
        </div>

        {!hasLoaded && (
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-slate-200 sm:text-4xl">Mudae Gallery</h1>
          </div>
        )}

        {!hasLoaded && (
          <section className="mt-10 rounded-xl border border-slate-200/10 bg-slate-900/40 p-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Paste Collection</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Paste your mmi-s output lines in the format: Name - URL
                </p>
              </div>
              <textarea
                className="min-h-[160px] w-full rounded-lg border border-slate-200/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-teal-400/60 focus:outline-none"
                placeholder="Saber - https://mudae.net/uploads/...\nSamira - https://mudae.net/uploads/..."
                value={rawInput}
                onChange={(event) => setRawInput(event.target.value)}
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="rounded-full bg-teal-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-teal-200 transition hover:bg-teal-400/20"
                  type="button"
                  onClick={handleApply}
                  disabled={!parsedPreview.length}
                >
                  Load {parsedPreview.length ? parsedPreview.length : ''} Cards
                </button>
                <button
                  className="rounded-full border border-slate-200/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-slate-200/40"
                  type="button"
                  onClick={handleClear}
                  disabled={!rawInput.length}
                >
                  Clear
                </button>
                <span className="text-xs text-slate-500">
                  {parsedPreview.length ? `${parsedPreview.length} cards ready` : 'Paste your list to preview'}
                </span>
              </div>
            </div>
          </section>
        )}

        {hasLoaded && (
            <section className={`flex flex-1 flex-col items-center ${isFullscreen ? 'mt-6' : 'mt-12'}`}>
              <div className="flex w-full max-w-4xl flex-col items-center">
                <div className="flex w-full items-center justify-end">
                  <span className="text-xs text-slate-500">
                    {selectedIndex + 1} / {collections.length}
                  </span>
                </div>
                <div className={`flex w-full items-center justify-center ${isFullscreen ? 'h-[820px] mt-0' : 'h-[560px] mt-4'}`}>
                  {selectedCharacter?.imageUrl ? (
                      <img
                        ref={mainImageRef}
                        src={getImageUrl(selectedCharacter.imageUrl)}
                        alt={selectedCharacter.name}
                        className={`h-full w-auto max-w-none object-contain ${
                          slideDirection === 'left'
                            ? 'animate-slide-left'
                            : slideDirection === 'right'
                              ? 'animate-slide-right'
                              : ''
                        }`}
                      />
                  ) : (
                    <div className="h-full w-full rounded-xl bg-gradient-to-br from-teal-500/20 via-slate-700/30 to-black/40"></div>
                  )}
                </div>
                <div className="mt-4 flex w-full items-center justify-center">
                  <h2 className="text-base font-semibold text-slate-200 text-center">{selectedCharacter?.name}</h2>
                </div>
              </div>

            <div className="mt-8 w-full max-w-5xl rounded-xl border border-slate-200/10 bg-slate-900/30 p-4">
              {!isFullscreen && (
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Carousel</h3>
                  <div className="flex gap-2">
                      <button
                      className="rounded-full border border-slate-200/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-slate-200/40"
                      type="button"
                        onClick={() => {
                          const nextIndex = carouselAnchorIndex > 0 ? carouselAnchorIndex - 1 : collections.length - 1;
                          animateCarouselToIndex(nextIndex, -1);
                        }}
                    >
                      Prev
                    </button>
                    <button
                      className="rounded-full border border-slate-200/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-slate-200/40"
                      type="button"
                        onClick={() => {
                          const nextIndex = carouselAnchorIndex < collections.length - 1 ? carouselAnchorIndex + 1 : 0;
                          animateCarouselToIndex(nextIndex, 1);
                        }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
                <div className="mt-4 overflow-hidden pb-2">
                  <div
                    className={`flex items-center justify-center gap-3 ${
                      isCarouselAnimating ? 'transition-transform duration-300 ease-out' : ''
                    }`}
                    style={{ transform: `translateX(${carouselShift * -108}px)` }}
                  >
                    {carouselWindow.map((entry, index) => {
                      const centerIndex = Math.floor(carouselWindow.length / 2);
                      const isSelected = index === centerIndex;

                      return (
                        <button
                          key={`${entry.item.id}-${index}`}
                          className={`flex ${isFullscreen ? 'h-14 w-20' : 'h-20 w-24'} items-center justify-center rounded-lg border transition ${
                            isSelected
                              ? 'border-teal-300/60 bg-teal-400/10'
                              : 'border-slate-200/10 bg-slate-950/30 hover:border-slate-200/30'
                          }`}
                          type="button"
                          onClick={() => {
                            const delta = index - centerIndex;
                            const targetIndex = entry.index;
                            animateCarouselToIndex(targetIndex, delta);
                          }}
                        >
                          {entry.item.imageUrl ? (
                            <img
                              src={getImageUrl(entry.item.imageUrl)}
                              alt={entry.item.name}
                              className="h-full w-full rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-full w-full rounded bg-gradient-to-br from-teal-500/10 via-slate-700/20 to-black/30"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
              </div>
            </div>

              {!isFullscreen && (
                <div className="mt-6 w-full max-w-5xl rounded-xl border border-slate-200/10 bg-slate-900/30 p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Background</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                          backgroundStyle === 'adaptive'
                            ? 'border-teal-300/60 bg-teal-400/10 text-teal-200'
                            : 'border-slate-200/20 text-slate-300 hover:border-slate-200/40'
                        }`}
                        onClick={() => setBackgroundStyle('adaptive')}
                      >
                        Adaptive
                      </button>
                    <button
                      type="button"
                      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        backgroundStyle === 'bg-slate-900'
                          ? 'border-teal-300/60 bg-teal-400/10 text-teal-200'
                          : 'border-slate-200/20 text-slate-300 hover:border-slate-200/40'
                      }`}
                      onClick={() => setBackgroundStyle('bg-slate-900')}
                    >
                      Default
                    </button>
                    <button
                      type="button"
                      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        backgroundStyle === 'bg-black'
                          ? 'border-teal-300/60 bg-teal-400/10 text-teal-200'
                          : 'border-slate-200/20 text-slate-300 hover:border-slate-200/40'
                      }`}
                      onClick={() => setBackgroundStyle('bg-black')}
                    >
                      Black
                    </button>
                    <button
                      type="button"
                      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        backgroundStyle === 'bg-emerald-950'
                          ? 'border-teal-300/60 bg-teal-400/10 text-teal-200'
                          : 'border-slate-200/20 text-slate-300 hover:border-slate-200/40'
                      }`}
                      onClick={() => setBackgroundStyle('bg-emerald-950')}
                    >
                      Emerald
                    </button>
                    <button
                      type="button"
                      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        backgroundStyle === 'bg-cyan-950'
                          ? 'border-teal-300/60 bg-teal-400/10 text-teal-200'
                          : 'border-slate-200/20 text-slate-300 hover:border-slate-200/40'
                      }`}
                      onClick={() => setBackgroundStyle('bg-cyan-950')}
                    >
                      Cyan
                    </button>
                    <button
                      type="button"
                      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        backgroundStyle === 'bg-sky-950'
                          ? 'border-teal-300/60 bg-teal-400/10 text-teal-200'
                          : 'border-slate-200/20 text-slate-300 hover:border-slate-200/40'
                      }`}
                      onClick={() => setBackgroundStyle('bg-sky-950')}
                    >
                      Sky
                    </button>
                    <button
                      type="button"
                      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        backgroundStyle === 'bg-violet-950'
                          ? 'border-teal-300/60 bg-teal-400/10 text-teal-200'
                          : 'border-slate-200/20 text-slate-300 hover:border-slate-200/40'
                      }`}
                      onClick={() => setBackgroundStyle('bg-violet-950')}
                    >
                      Violet
                    </button>
                    <button
                      type="button"
                      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        backgroundStyle === 'bg-rose-950'
                          ? 'border-teal-300/60 bg-teal-400/10 text-teal-200'
                          : 'border-slate-200/20 text-slate-300 hover:border-slate-200/40'
                      }`}
                      onClick={() => setBackgroundStyle('bg-rose-950')}
                    >
                      Rose
                    </button>
                    <button
                      type="button"
                      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        backgroundStyle === 'bg-amber-950'
                          ? 'border-teal-300/60 bg-teal-400/10 text-teal-200'
                          : 'border-slate-200/20 text-slate-300 hover:border-slate-200/40'
                      }`}
                      onClick={() => setBackgroundStyle('bg-amber-950')}
                    >
                      Amber
                    </button>
                    <button
                      type="button"
                      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        backgroundStyle === 'bg-fuchsia-950'
                          ? 'border-teal-300/60 bg-teal-400/10 text-teal-200'
                          : 'border-slate-200/20 text-slate-300 hover:border-slate-200/40'
                      }`}
                      onClick={() => setBackgroundStyle('bg-fuchsia-950')}
                    >
                      Fuchsia
                    </button>
                    <button
                      type="button"
                      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        backgroundStyle === 'bg-indigo-950'
                          ? 'border-teal-300/60 bg-teal-400/10 text-teal-200'
                          : 'border-slate-200/20 text-slate-300 hover:border-slate-200/40'
                      }`}
                      onClick={() => setBackgroundStyle('bg-indigo-950')}
                    >
                      Indigo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
