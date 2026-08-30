import Link from "next/link";
import {
  CategoryId,
  LEAN_COLORS,
  LEAN_LABELS,
  LEAN_ORDER,
  NewsSourceId,
  PoliticalLean,
} from "@/lib/config";

interface LeanNavProps {
  categoryId: CategoryId;
  activeLean: PoliticalLean | "all";
  activeSourceId: NewsSourceId | "all";
}

function buildLeanHref(
  categoryId: CategoryId,
  lean: PoliticalLean | "all",
  activeSourceId: NewsSourceId | "all",
) {
  const params = new URLSearchParams();
  if (activeSourceId !== "all") params.set("source", activeSourceId);
  if (lean !== "all") params.set("lean", lean);
  const query = params.toString();
  return query ? `/${categoryId}?${query}` : `/${categoryId}`;
}

export function LeanNav({
  categoryId,
  activeLean,
  activeSourceId,
}: LeanNavProps) {
  const options: { id: PoliticalLean | "all"; label: string; color?: string }[] =
    [
      { id: "all", label: "All" },
      ...LEAN_ORDER.map((lean) => ({
        id: lean,
        label: LEAN_LABELS[lean],
        color: LEAN_COLORS[lean],
      })),
    ];

  return (
    <nav
      className="scrollbar-hide -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1"
      aria-label="Political lean"
    >
      {options.map(({ id, label, color }) => {
        const isActive = activeLean === id;
        return (
          <Link
            key={id}
            href={buildLeanHref(categoryId, id, activeSourceId)}
            className={`flex shrink-0 items-center rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "text-white shadow-sm"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
            style={
              isActive && color
                ? { backgroundColor: color }
                : isActive
                  ? { backgroundColor: "#0f172a" }
                  : undefined
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export { buildLeanHref };
