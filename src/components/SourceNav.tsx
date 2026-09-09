import Link from "next/link";
import {
  CategoryId,
  NEWS_SOURCES,
  NewsSourceId,
  SOURCE_ORDER,
} from "@/lib/config";
import { buildCategoryPageHref, buildWeeklySummaryHref, ViewMode } from "@/lib/url";
import { WeeklyCategoryId } from "@/lib/weekly";

interface SourceNavProps {
  categoryId: CategoryId;
  activeSourceId: NewsSourceId | "all";
  viewMode?: ViewMode;
  weeklyCategoryId?: WeeklyCategoryId;
}

function buildSourceHref(
  categoryId: CategoryId,
  source: NewsSourceId | "all",
  viewMode: ViewMode,
  weeklyCategoryId: WeeklyCategoryId,
): string {
  if (viewMode === "weekly") {
    return buildWeeklySummaryHref(weeklyCategoryId, { source });
  }
  return buildCategoryPageHref(categoryId, { source });
}

export function SourceNav({
  categoryId,
  activeSourceId,
  viewMode = "latest",
  weeklyCategoryId = categoryId,
}: SourceNavProps) {
  return (
    <nav
      className="scrollbar-hide -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1"
      aria-label="News sources"
    >
      <Link
        href={buildSourceHref(categoryId, "all", viewMode, weeklyCategoryId)}
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
            href={buildSourceHref(
              categoryId,
              sourceId,
              viewMode,
              weeklyCategoryId,
            )}
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
