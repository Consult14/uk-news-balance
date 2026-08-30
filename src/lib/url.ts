import { CategoryId, NewsSourceId, PoliticalLean } from "./config";

export type ViewMode = "grouped" | "columns";

export function isViewMode(value: string): value is ViewMode {
  return value === "grouped" || value === "columns";
}

export function buildCategoryPageHref(
  categoryId: CategoryId,
  options?: {
    source?: NewsSourceId | "all";
    lean?: PoliticalLean | "all";
    view?: ViewMode;
  },
): string {
  const params = new URLSearchParams();

  if (options?.source && options.source !== "all") {
    params.set("source", options.source);
  }

  if (options?.lean && options.lean !== "all") {
    params.set("lean", options.lean);
  }

  if (options?.view && options.view !== "columns") {
    params.set("view", options.view);
  }

  const query = params.toString();
  return query ? `/${categoryId}?${query}` : `/${categoryId}`;
}
