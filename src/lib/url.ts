import { CategoryId, NewsSourceId } from "./config";

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
