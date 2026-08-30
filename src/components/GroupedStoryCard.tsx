"use client";

import { useRef, useState } from "react";
import { StoryCluster } from "@/lib/config";
import { SourceBadge } from "./NewsCard";

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

interface GroupedStoryCardProps {
  cluster: StoryCluster;
}

export function GroupedStoryCard({ cluster }: GroupedStoryCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const activeItem = cluster.items[activeIndex] ?? cluster.items[0];
  const hasMultiple = cluster.items.length > 1;

  function goToIndex(index: number) {
    const wrapped =
      ((index % cluster.items.length) + cluster.items.length) %
      cluster.items.length;
    setActiveIndex(wrapped);
  }

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null || !hasMultiple) return;

    const endX = event.changedTouches[0]?.clientX;
    if (endX === undefined) return;

    const deltaX = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) < 48) return;

    if (deltaX < 0) {
      goToIndex(activeIndex + 1);
    } else {
      goToIndex(activeIndex - 1);
    }
  }

  return (
    <article
      className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200/80 transition hover:-translate-y-0.5 hover:shadow-md"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <a
        href={activeItem.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group block p-4 active:scale-[0.99]"
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <SourceBadge
              name={activeItem.source.shortName}
              color={activeItem.source.color}
            />
            {hasMultiple ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                {cluster.sourceCount} outlets
              </span>
            ) : null}
          </div>
          <time
            className="shrink-0 text-xs text-slate-500"
            dateTime={activeItem.publishedAt}
          >
            {formatRelativeTime(activeItem.publishedAt)}
          </time>
        </div>

        <h3 className="text-[15px] font-semibold leading-snug text-slate-900 group-hover:text-blue-700">
          {activeItem.title}
        </h3>

        {activeItem.summary ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
            {activeItem.summary}
          </p>
        ) : null}
      </a>

      {hasMultiple ? (
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
          <button
            type="button"
            aria-label="Previous outlet"
            className="rounded-md px-2 py-1 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            onClick={() => goToIndex(activeIndex - 1)}
          >
            ‹
          </button>

          <div
            className="flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label="Switch outlet"
          >
            {cluster.items.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${item.source.shortName} version`}
                  title={item.source.name}
                  className="rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
                  onClick={() => setActiveIndex(index)}
                >
                  <span
                    className="block h-2.5 w-2.5 rounded-full ring-2 ring-white"
                    style={{
                      backgroundColor: item.source.color,
                      opacity: isActive ? 1 : 0.35,
                      transform: isActive ? "scale(1.15)" : "scale(1)",
                    }}
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Next outlet"
            className="rounded-md px-2 py-1 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            onClick={() => goToIndex(activeIndex + 1)}
          >
            ›
          </button>
        </div>
      ) : null}
    </article>
  );
}
