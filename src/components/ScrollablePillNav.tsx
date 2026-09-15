"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

interface ScrollablePillNavProps {
  children: ReactNode;
  "aria-label": string;
  className?: string;
}

export function ScrollablePillNav({
  children,
  "aria-label": ariaLabel,
  className = "",
}: ScrollablePillNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();

    function onScroll() {
      if (!hintDismissed && el!.scrollLeft > 8) {
        setHintDismissed(true);
      }
      updateScrollState();
    }

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", onScroll);
    };
  }, [hintDismissed, updateScrollState]);

  const showHint = canScrollRight && !hintDismissed;

  return (
    <div className={`relative -mx-4 ${className}`}>
      <div className="relative">
        <nav
          ref={scrollRef}
          className="scrollbar-hide flex gap-2 overflow-x-auto px-4 pb-1"
          aria-label={ariaLabel}
        >
          {children}
        </nav>

        {canScrollLeft ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent md:hidden"
          />
        ) : null}

        {canScrollRight ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent md:hidden"
          />
        ) : null}

        {showHint ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center pr-1 md:hidden"
          >
            <span className="scroll-hint-badge flex items-center gap-0.5 rounded-full bg-white/95 px-2 py-1 text-[11px] font-semibold text-brand-blue shadow-sm ring-1 ring-brand-blue/25">
              Swipe
              <span className="scroll-hint-arrow">›</span>
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
