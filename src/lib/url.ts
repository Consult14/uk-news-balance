import { CategoryId, NewsSourceId } from "./config";

export type ViewMode = "grouped" | "columns";

export function isViewMode(value: string): value is ViewMode {
  return value === "grouped" || value === "columns";
}

export function buildCategoryPageHref(
  categoryId: CategoryId,
  options?: {
    source?: NewsSourceId | "all";
    view?: ViewMode;
  },
): string {
  const params = new URLSearchParams();

  if (options?.source && options.source !== "all") {
    params.set("source", options.source);
  }

  if (options?.view && options.view !== "grouped") {
    params.set("view", options.view);
  }

  const query = params.toString();
  return query ? `/${categoryId}?${query}` : `/${categoryId}`;
}
