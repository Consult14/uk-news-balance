import Link from "next/link";
import { CategoryId, NewsSourceId, PoliticalLean } from "@/lib/config";
import { buildCategoryPageHref, ViewMode } from "@/lib/url";

interface ViewToggleProps {
  categoryId: CategoryId;
  activeView: ViewMode;
  activeSourceId: NewsSourceId | "all";
  activeLean?: PoliticalLean | "all";
}

export function ViewToggle({
  categoryId,
  activeView,
  activeSourceId,
  activeLean = "all",
}: ViewToggleProps) {
  const options: { id: ViewMode; label: string; description: string }[] = [
    {
      id: "grouped",
      label: "Grouped",
      description: "Same story across outlets in one card",
    },
    {
      id: "columns",
      label: "Columns",
      description: "Headlines in Left, Centre, and Right columns",
    },
  ];

  return (
    <nav
      className="scrollbar-hide -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1"
      aria-label="Layout view"
    >
      {options.map((option) => {
        const isActive = activeView === option.id;
        return (
          <Link
            key={option.id}
            href={buildCategoryPageHref(categoryId, {
              source: activeSourceId,
              lean: activeLean,
              view: option.id,
            })}
            title={option.description}
            className={`flex shrink-0 items-center rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}
