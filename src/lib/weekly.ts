import {
  CATEGORIES,
  CategoryId,
  NewsSourceId,
  SOURCE_ORDER,
  StoryCluster,
} from "./config";
import { fetchCategoryClusters } from "./rss";

export const WEEKLY_DAYS = 7;
export const WEEKLY_ITEMS_PER_SOURCE = 25;
const WEEKLY_MAX_TIME_DIFF_MS = WEEKLY_DAYS * 24 * 60 * 60 * 1000;

export type WeeklyCategoryId = CategoryId | "all";

export function isWeeklyCategoryId(value: string): value is WeeklyCategoryId {
  return value === "all" || CATEGORIES.some((category) => category.id === value);
}

export function isWithinLastDays(isoDate: string, days: number): boolean {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return false;

  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return date.getTime() >= cutoff;
}

export function getWeekRangeLabel(days = WEEKLY_DAYS): string {
  const end = new Date();
  const start = new Date(end.getTime() - (days - 1) * 24 * 60 * 60 * 1000);

  const sameYear = start.getFullYear() === end.getFullYear();
  const startOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  };
  const endOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  const startLabel = start.toLocaleDateString("en-GB", startOptions);
  const endLabel = end.toLocaleDateString("en-GB", endOptions);

  return `${startLabel} – ${endLabel}`;
}

function filterClustersToWeek(clusters: StoryCluster[]): StoryCluster[] {
  return clusters.filter((cluster) =>
    isWithinLastDays(cluster.publishedAt, WEEKLY_DAYS),
  );
}

async function fetchWeeklyClustersForCategory(
  categoryId: CategoryId,
  sourceIds: NewsSourceId[],
): Promise<StoryCluster[]> {
  const clusters = await fetchCategoryClusters(categoryId, sourceIds, {
    itemsPerSource: WEEKLY_ITEMS_PER_SOURCE,
    maxTimeDiffMs: WEEKLY_MAX_TIME_DIFF_MS,
  });

  return filterClustersToWeek(clusters);
}

export async function fetchWeeklySummary(
  categoryId: WeeklyCategoryId,
  sourceIds: NewsSourceId[] = SOURCE_ORDER,
): Promise<StoryCluster[]> {
  if (categoryId === "all") {
    const clusterGroups = await Promise.all(
      CATEGORIES.map((category) =>
        fetchWeeklyClustersForCategory(category.id, sourceIds),
      ),
    );

    const merged = clusterGroups.flat();
    const seen = new Set<string>();
    const unique = merged.filter((cluster) => {
      if (seen.has(cluster.id)) return false;
      seen.add(cluster.id);
      return true;
    });

    return unique.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }

  return fetchWeeklyClustersForCategory(categoryId, sourceIds);
}

export function buildWeeklyDigest(clusters: StoryCluster[]): string {
  if (clusters.length === 0) {
    return "No major stories were captured from UK outlets this week. Feeds may be temporarily unavailable.";
  }

  const topStories = [...clusters]
    .sort((a, b) => b.sourceCount - a.sourceCount)
    .slice(0, 5);

  const widelyCovered = topStories.filter((cluster) => cluster.sourceCount >= 2);
  const leadStories = widelyCovered.length > 0 ? widelyCovered : topStories;

  const headlines = leadStories
    .slice(0, 3)
    .map((cluster) => cluster.canonicalTitle)
    .join("; ");

  const crossOutletCount = clusters.filter(
    (cluster) => cluster.sourceCount >= 2,
  ).length;

  if (crossOutletCount >= 3) {
    return `This week across UK outlets, ${clusters.length} stories stood out with ${crossOutletCount} covered by multiple publishers. Leading themes include: ${headlines}.`;
  }

  return `This week's ${clusters.length} headline${clusters.length === 1 ? "" : "s"} from UK outlets include: ${headlines}.`;
}
