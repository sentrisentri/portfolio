"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

type SorterEntry = {
  id: string;
  name: string;
  imageUrl?: string;
};

export default function MudaeSorterPage() {
  const [rawInput, setRawInput] = useState('');
  const [entries, setEntries] = useState<SorterEntry[]>([]);
  const [useCompactGrid, setUseCompactGrid] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [exportOutput, setExportOutput] = useState('');
  const [copyLabel, setCopyLabel] = useState('Copy');
  const [isDivorceMode, setIsDivorceMode] = useState(false);
  const [selectedForDivorce, setSelectedForDivorce] = useState<string[]>([]);
  const [isTradeMode, setIsTradeMode] = useState(false);
  const [selectedForTrade, setSelectedForTrade] = useState<string[]>([]);
  const dragStateRef = useRef<{
    fromIndex: number;
    lastOverIndex: number;
    ghostEl: HTMLDivElement | null;
    moveHandler: (e: MouseEvent) => void;
    endHandler: () => void;
  } | null>(null);

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return undefined;
    return `/api/image?url=${encodeURIComponent(imageUrl)}`;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

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

  const parsedPreview = useMemo(() => {
    if (!rawInput.trim()) return [] as SorterEntry[];

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

        return { id: `p-${index}`, name, imageUrl } as SorterEntry;
      })
      .filter((entry): entry is SorterEntry => Boolean(entry));
  }, [rawInput]);

  const hasLoaded = entries.length > 0;
  const exportCommand = useMemo(() => {
    if (!entries.length) return '';
    return `$sm ${entries.map((entry) => entry.name).join(' $ ')}`;
  }, [entries]);

  const handleApply = () => {
    setEntries(parsedPreview);
    setIsDivorceMode(false);
    setSelectedForDivorce([]);
    setIsTradeMode(false);
    setSelectedForTrade([]);
  };

  const handleClear = () => {
    setRawInput('');
    setEntries([]);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsDivorceMode(false);
    setSelectedForDivorce([]);
    setIsTradeMode(false);
    setSelectedForTrade([]);
  };

  const moveEntry = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setEntries((prev) => {
      if (fromIndex < 0 || toIndex < 0 || fromIndex >= prev.length || toIndex >= prev.length) {
        return prev;
      }

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handlePointerDown = (index: number, entry: SorterEntry, event: React.MouseEvent<HTMLLIElement>) => {
    if (isDivorceMode || isTradeMode) return;
    if (event.button !== 0) return;
    event.preventDefault();

    const ghost = document.createElement('div');
    ghost.style.cssText = [
      'position:fixed',
      'pointer-events:none',
      'z-index:9999',
      'background:rgba(15,23,42,0.92)',
      'border:1px solid rgba(148,163,184,0.35)',
      'border-radius:6px',
      'padding:4px',
      'max-width:72px',
      'box-shadow:0 8px 32px rgba(0,0,0,0.6)',
      'transform:scale(1.06)',
      'overflow:hidden',
    ].join(';');

    if (entry.imageUrl) {
      const img = document.createElement('img');
      img.src = `/api/image?url=${encodeURIComponent(entry.imageUrl)}`;
      img.style.cssText = 'width:64px;height:96px;object-fit:cover;border-radius:4px;display:block;';
      ghost.appendChild(img);
    } else {
      ghost.style.color = '#f8fafc';
      ghost.style.fontSize = '10px';
      ghost.style.padding = '8px';
      ghost.textContent = entry.name;
    }

    document.body.appendChild(ghost);
    setDraggedIndex(index);
    setDragOverIndex(index);

    const moveHandler = (e: MouseEvent) => {
      if (!dragStateRef.current) return;
      ghost.style.left = `${e.clientX + 14}px`;
      ghost.style.top = `${e.clientY - 10}px`;

      ghost.style.display = 'none';
      const els = document.elementsFromPoint(e.clientX, e.clientY);
      ghost.style.display = '';
      for (const el of els) {
        const li = (el as HTMLElement).closest('[data-entry-index]') as HTMLElement | null;
        if (li) {
          const over = parseInt(li.dataset.entryIndex ?? '', 10);
          if (!Number.isNaN(over) && over !== dragStateRef.current.lastOverIndex) {
            dragStateRef.current.lastOverIndex = over;
            setDragOverIndex(over);
          }
          break;
        }
      }
    };

    const endHandler = () => {
      if (!dragStateRef.current) return;
      const { fromIndex, lastOverIndex, ghostEl } = dragStateRef.current;
      if (ghostEl && document.body.contains(ghostEl)) document.body.removeChild(ghostEl);
      moveEntry(fromIndex, lastOverIndex);
      setDraggedIndex(null);
      setDragOverIndex(null);
      dragStateRef.current = null;
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', endHandler);
    };

    dragStateRef.current = { fromIndex: index, lastOverIndex: index, ghostEl: ghost, moveHandler, endHandler };
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', endHandler);
  };

  const handleExport = async () => {
    if (!exportCommand) return;

    setExportOutput(exportCommand);
    setCopyLabel('Copy');
  };

  const handleToggleDivorceMode = () => {
    if (!isDivorceMode) {
      setIsTradeMode(false);
      setSelectedForTrade([]);
    }

    setIsDivorceMode((prev) => {
      if (prev) {
        setSelectedForDivorce([]);
      }
      return !prev;
    });
  };

  const handleToggleDivorceSelection = (entryId: string) => {
    if (!isDivorceMode) return;

    setSelectedForDivorce((prev) => {
      if (prev.includes(entryId)) {
        return prev.filter((id) => id !== entryId);
      }
      return [...prev, entryId];
    });
  };

  const handleFinalizeDivorce = () => {
    if (!selectedForDivorce.length) return;

    const selectedNames = selectedForDivorce
      .map((id) => entries.find((entry) => entry.id === id)?.name)
      .filter((name): name is string => Boolean(name));

    if (!selectedNames.length) return;

    setExportOutput(`$divorce ${selectedNames.join(' $ ')}`);
    setCopyLabel('Copy');
    setIsDivorceMode(false);
    setSelectedForDivorce([]);
  };

  const handleToggleTradeMode = () => {
    if (!isTradeMode) {
      setIsDivorceMode(false);
      setSelectedForDivorce([]);
    }

    setIsTradeMode((prev) => {
      if (prev) {
        setSelectedForTrade([]);
      }
      return !prev;
    });
  };

  const handleToggleTradeSelection = (entryId: string) => {
    if (!isTradeMode) return;

    setSelectedForTrade((prev) => {
      if (prev.includes(entryId)) {
        return prev.filter((id) => id !== entryId);
      }
      return [...prev, entryId];
    });
  };

  const handleFinalizeTrade = () => {
    if (!selectedForTrade.length) return;

    const selectedNames = selectedForTrade
      .map((id) => entries.find((entry) => entry.id === id)?.name)
      .filter((name): name is string => Boolean(name));

    if (!selectedNames.length) return;

    setExportOutput(`$trade "recipient" ${selectedNames.join(' $ ')}`);
    setCopyLabel('Copy');
    setIsTradeMode(false);
    setSelectedForTrade([]);
  };

  const handleCopyExport = async () => {
    if (!exportOutput) return;

    try {
      await navigator.clipboard.writeText(exportOutput);
      setCopyLabel('Copied');
      window.setTimeout(() => setCopyLabel('Copy'), 1200);
    } catch {
      setCopyLabel('Failed');
      window.setTimeout(() => setCopyLabel('Copy'), 1200);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black text-slate-300 font-sans animate-fade-in">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-950 via-slate-950 to-black transition-opacity duration-700 ${isDivorceMode ? 'opacity-100' : 'opacity-0'}`}
      ></div>
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-950 to-black transition-opacity duration-700 ${isTradeMode ? 'opacity-100' : 'opacity-0'}`}
      ></div>
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-16 md:px-10 lg:px-16">
        <div className="flex items-center justify-between gap-4">
          <Link className="inline-flex items-center text-sm font-medium text-teal-300 hover:text-teal-200" href="/mudae-tools">
            <span className="mr-2">←</span>
            Back to Mudae Tools
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-slate-200 sm:text-4xl">Mudae Sorter</h1>
        </div>

        <section className="mt-8 rounded-xl border border-slate-200/10 bg-slate-900/40 p-6">
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

        {hasLoaded && (
          <section className="mt-8 rounded-xl border border-slate-200/10 bg-slate-900/30 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">Loaded Entries</h3>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleDivorceMode}
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide transition ${isDivorceMode ? 'bg-purple-500/20 text-purple-200 border border-purple-300/40' : 'border border-slate-200/20 text-slate-300 hover:border-slate-200/40'}`}
                >
                  {isDivorceMode ? 'Cancel divorce mode' : 'Divorce mode'}
                </button>
                <button
                  type="button"
                  onClick={handleToggleTradeMode}
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide transition ${isTradeMode ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-300/40' : 'border border-slate-200/20 text-slate-300 hover:border-slate-200/40'}`}
                >
                  {isTradeMode ? 'Cancel trade mode' : 'Trade mode'}
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="rounded-full bg-teal-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-teal-200 transition hover:bg-teal-400/20"
                >
                  Export $sm
                </button>
                <button
                  type="button"
                  onClick={() => setUseCompactGrid((prev) => !prev)}
                  className="rounded-full border border-slate-200/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-300 transition hover:border-slate-200/40"
                >
                  {useCompactGrid ? 'Normal size' : 'Smaller images'}
                </button>
                <span className="text-xs text-slate-500">{entries.length} total</span>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className="text-xs text-slate-500">
                {isDivorceMode ? 'Click cards to select for divorce.' : isTradeMode ? 'Click cards to select for trade.' : 'Drag cards to reorder.'}
              </p>
              {isDivorceMode && (
                <>
                  <span className="text-xs text-purple-200">{selectedForDivorce.length} selected</span>
                  <button
                    type="button"
                    onClick={handleFinalizeDivorce}
                    disabled={!selectedForDivorce.length}
                    className="rounded-full bg-purple-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-purple-100 transition hover:bg-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Done ($divorce)
                  </button>
                </>
              )}
              {isTradeMode && (
                <>
                  <span className="text-xs text-slate-400">Using placeholder: &ldquo;recipient&rdquo;</span>
                  <span className="text-xs text-emerald-200">{selectedForTrade.length} selected</span>
                  <button
                    type="button"
                    onClick={handleFinalizeTrade}
                    disabled={!selectedForTrade.length}
                    className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-100 transition hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Done ($trade)
                  </button>
                </>
              )}
            </div>
            {exportOutput && (
              <div className="mt-3 rounded-lg border border-slate-200/10 bg-slate-950/40 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Export Output</p>
                  <button
                    type="button"
                    onClick={handleCopyExport}
                    className="rounded-full border border-slate-200/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-300 transition hover:border-slate-200/40"
                  >
                    {copyLabel}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={exportOutput}
                  className="mt-2 min-h-[72px] w-full rounded-md border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            )}
            <ol
              className={`mt-4 grid ${useCompactGrid ? 'grid-cols-4 gap-1.5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12' : 'grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8'}`}
            >
              {entries.map((entry, index) => (
                <li
                  key={entry.id}
                  data-entry-index={index}
                  onMouseDown={(event) => handlePointerDown(index, entry, event)}
                  onClick={() => {
                    handleToggleDivorceSelection(entry.id);
                    handleToggleTradeSelection(entry.id);
                  }}
                  className={`overflow-hidden rounded-md border bg-slate-900/50 select-none transition ${draggedIndex === index ? 'opacity-40 border-teal-400/60' : 'border-slate-700/70'} ${dragOverIndex === index && draggedIndex !== index ? 'ring-1 ring-teal-300/70' : ''} ${isDivorceMode || isTradeMode ? 'cursor-pointer' : 'cursor-grab'} ${selectedForDivorce.includes(entry.id) ? 'ring-2 ring-purple-300 border-purple-300/70' : ''} ${selectedForTrade.includes(entry.id) ? 'ring-2 ring-emerald-300 border-emerald-300/70' : ''}`}
                >
                  <div className="relative aspect-[2/3] w-full bg-slate-800/60">
                    {entry.imageUrl ? (
                      <img
                        src={getImageUrl(entry.imageUrl)}
                        alt={entry.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                        No image
                      </div>
                    )}
                    <div className="absolute left-1.5 top-1.5 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-slate-100">
                      #{index + 1}
                    </div>
                    {useCompactGrid && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-1.5 pb-1 pt-3 text-[10px] font-medium text-slate-100 truncate" title={entry.name}>
                        {entry.name}
                      </div>
                    )}
                  </div>
                  {!useCompactGrid && (
                    <div className="px-2 py-1.5 text-xs font-medium text-slate-200 truncate" title={entry.name}>
                      {entry.name}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  );
}
