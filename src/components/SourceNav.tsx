import Link from "next/link";
import {
  CategoryId,
  NEWS_SOURCES,
  NewsSourceId,
  PoliticalLean,
  SOURCE_ORDER,
} from "@/lib/config";
import { buildCategoryPageHref, ViewMode } from "@/lib/url";

interface SourceNavProps {
  categoryId: CategoryId;
  activeSourceId: NewsSourceId | "all";
  activeLean?: PoliticalLean | "all";
  activeView?: ViewMode;
}

export function SourceNav({
  categoryId,
  activeSourceId,
  activeLean = "all",
  activeView = "grouped",
}: SourceNavProps) {
  return (
    <nav
      className="scrollbar-hide -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1"
      aria-label="News sources"
    >
      <Link
        href={buildCategoryPageHref(categoryId, {
          source: "all",
          lean: activeLean,
          view: activeView,
        })}
        className={`flex shrink-0 items-center rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
          activeSourceId === "all"
            ? "bg-slate-900 text-white shadow-sm"
            : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
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
            href={buildCategoryPageHref(categoryId, {
              source: sourceId,
              lean: activeLean,
              view: activeView,
            })}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "text-white shadow-sm"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
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
