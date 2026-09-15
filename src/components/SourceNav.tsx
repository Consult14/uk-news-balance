import Link from "next/link";
import {
  CategoryId,
  NEWS_SOURCES,
  NewsSourceId,
  SOURCE_ORDER,
} from "@/lib/config";
import { buildCategoryPageHref } from "@/lib/url";

interface SourceNavProps {
  categoryId: CategoryId;
  activeSourceId: NewsSourceId | "all";
}

export function SourceNav({ categoryId, activeSourceId }: SourceNavProps) {
  return (
    <nav
      className="scrollbar-hide -mx-4 flex h-9 items-center gap-1 overflow-x-auto px-4 sm:h-8"
      aria-label="News sources"
    >
      <Link
        href={buildCategoryPageHref(categoryId, { source: "all" })}
        className={`flex h-11 shrink-0 items-center rounded-full px-2.5 text-[13px] font-medium transition-colors sm:h-8 sm:px-2 sm:text-xs ${
          activeSourceId === "all"
            ? "bg-slate-800 text-white"
            : "bg-slate-100/80 text-slate-600 ring-1 ring-slate-200/60 hover:bg-slate-100"
        }`}
      >
        All
      </Link>
      {SOURCE_ORDER.map((sourceId) => {
        const source = NEWS_SOURCES[sourceId];
        const isActive = activeSourceId === sourceId;
        return (
          <Link
            key={sourceId}
            href={buildCategoryPageHref(categoryId, { source: sourceId })}
            className={`flex h-11 shrink-0 items-center rounded-full px-2.5 text-[13px] font-medium transition-colors sm:h-8 sm:px-2 sm:text-xs ${
              isActive
                ? "text-white shadow-sm"
                : "bg-slate-100/80 text-slate-600 ring-1 ring-slate-200/60 hover:bg-slate-100"
            }`}
            style={
              isActive
                ? { backgroundColor: source.color }
                : undefined
            }
          >
            {source.shortName}
          </Link>
        );
      })}
    </nav>
  );
}
