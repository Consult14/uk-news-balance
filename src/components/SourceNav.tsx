import Link from "next/link";
import {
  CategoryId,
  NEWS_SOURCES,
  NewsSourceId,
  SOURCE_ORDER,
} from "@/lib/config";

interface SourceNavProps {
  categoryId: CategoryId;
  activeSourceId: NewsSourceId | "all";
}

function buildSourceHref(categoryId: CategoryId, sourceId: NewsSourceId | "all") {
  if (sourceId === "all") return `/${categoryId}`;
  return `/${categoryId}?source=${sourceId}`;
}

export function SourceNav({ categoryId, activeSourceId }: SourceNavProps) {
  return (
    <nav
      className="scrollbar-hide -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1"
      aria-label="News sources"
    >
      <Link
        href={buildSourceHref(categoryId, "all")}
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
            href={buildSourceHref(categoryId, sourceId)}
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

export { buildSourceHref };
