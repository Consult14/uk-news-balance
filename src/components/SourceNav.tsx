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
      className="scrollbar-hide -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1"
      aria-label="News sources"
    >
      <Link
        href={buildCategoryPageHref(categoryId, { source: "all" })}
        className={`flex shrink-0 items-center rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
          activeSourceId === "all"
            ? "bg-brand-blue text-white shadow-sm"
            : "bg-white text-brand-navy ring-1 ring-brand-navy/15 hover:bg-brand-light"
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
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "text-white shadow-sm"
                : "bg-white text-brand-navy ring-1 ring-brand-navy/15 hover:bg-brand-light"
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
