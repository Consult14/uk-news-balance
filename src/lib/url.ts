import { CategoryId, NewsSourceId } from "./config";
import { WeeklyCategoryId } from "./weekly";

export type ViewMode = "latest" | "weekly";

export function buildCategoryPageHref(
  categoryId: CategoryId,
  options?: {
    source?: NewsSourceId | "all";
  },
): string {
  const params = new URLSearchParams();

  if (options?.source && options.source !== "all") {
    params.set("source", options.source);
  }

  const query = params.toString();
  return query ? `/${categoryId}?${query}` : `/${categoryId}`;
}

export function buildWeeklySummaryHref(
  categoryId: WeeklyCategoryId,
  options?: {
    source?: NewsSourceId | "all";
  },
): string {
  const params = new URLSearchParams();

  if (options?.source && options.source !== "all") {
    params.set("source", options.source);
  }

  const query = params.toString();
  return query
    ? `/weekly-summary/${categoryId}?${query}`
    : `/weekly-summary/${categoryId}`;
}
