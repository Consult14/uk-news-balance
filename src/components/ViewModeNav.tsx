import Link from "next/link";
import { CategoryId, NewsSourceId } from "@/lib/config";
import {
  buildCategoryPageHref,
  buildWeeklySummaryHref,
  ViewMode,
} from "@/lib/url";
import { WeeklyCategoryId } from "@/lib/weekly";

interface ViewModeNavProps {
  activeMode: ViewMode;
  categoryId: CategoryId;
  weeklyCategoryId?: WeeklyCategoryId;
  activeSourceId?: NewsSourceId | "all";
}

export function ViewModeNav({
  activeMode,
  categoryId,
  weeklyCategoryId = categoryId,
  activeSourceId = "all",
}: ViewModeNavProps) {
  const modes: { id: ViewMode; label: string; icon: string; href: string }[] = [
    {
      id: "latest",
      label: "Latest",
      icon: "⚡",
      href: buildCategoryPageHref(categoryId, { source: activeSourceId }),
    },
    {
      id: "weekly",
      label: "Weekly Summary",
      icon: "📅",
      href: buildWeeklySummaryHref(weeklyCategoryId, {
        source: activeSourceId,
      }),
    },
  ];

  return (
    <nav
      className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-2"
      aria-label="View mode"
    >
      {modes.map((mode) => {
        const isActive = mode.id === activeMode;
        return (
          <Link
            key={mode.id}
            href={mode.href}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            <span aria-hidden>{mode.icon}</span>
            {mode.label}
          </Link>
        );
      })}
    </nav>
  );
}
