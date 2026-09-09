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

function pickLeadHeadlines(clusters: StoryCluster[], count = 3): string[] {
  const topStories = [...clusters]
    .sort((a, b) => b.sourceCount - a.sourceCount)
    .slice(0, 5);

  const widelyCovered = topStories.filter((cluster) => cluster.sourceCount >= 2);
  const leadStories = widelyCovered.length > 0 ? widelyCovered : topStories;

  return leadStories.slice(0, count).map((cluster) => cluster.canonicalTitle);
}

export function buildCategoryWeeklyDigest(clusters: StoryCluster[]): string {
  if (clusters.length === 0) {
    return "Quiet week — no major stories captured from UK outlets.";
  }

  const headlines = pickLeadHeadlines(clusters);
  const crossOutletCount = clusters.filter(
    (cluster) => cluster.sourceCount >= 2,
  ).length;

  if (crossOutletCount >= 2) {
    return `${crossOutletCount} stories covered by multiple outlets, including ${headlines.join("; ")}.`;
  }

  return `Key stories include ${headlines.join("; ")}.`;
}

export function buildWeeklyDigest(clusters: StoryCluster[]): string {
  if (clusters.length === 0) {
    return "No major stories were captured from UK outlets this week. Feeds may be temporarily unavailable.";
  }

  const headlines = pickLeadHeadlines(clusters);
  const crossOutletCount = clusters.filter(
    (cluster) => cluster.sourceCount >= 2,
  ).length;

  if (crossOutletCount >= 3) {
    return `This week across UK outlets, ${clusters.length} stories stood out with ${crossOutletCount} covered by multiple publishers. Leading themes include: ${headlines.join("; ")}.`;
  }

  return `This week's ${clusters.length} headline${clusters.length === 1 ? "" : "s"} from UK outlets include: ${headlines.join("; ")}.`;
}

export interface CategoryWeeklySummary {
  id: CategoryId;
  name: string;
  icon: string;
  digest: string;
}

function mergeWeeklyClusters(clusterGroups: StoryCluster[][]): StoryCluster[] {
  const merged = clusterGroups.flat();
  const seen = new Set<string>();

  return merged
    .filter((cluster) => {
      if (seen.has(cluster.id)) return false;
      seen.add(cluster.id);
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export async function fetchWeeklySummariesByCategory(
  sourceIds: NewsSourceId[] = SOURCE_ORDER,
): Promise<{
  categorySummaries: CategoryWeeklySummary[];
  allClusters: StoryCluster[];
}> {
  const clusterGroups = await Promise.all(
    CATEGORIES.map(async (category) => ({
      category,
      clusters: await fetchWeeklyClustersForCategory(category.id, sourceIds),
    })),
  );

  const categorySummaries = clusterGroups.map(({ category, clusters }) => ({
    id: category.id,
    name: category.name,
    icon: category.icon,
    digest: buildCategoryWeeklyDigest(clusters),
  }));

  return {
    categorySummaries,
    allClusters: mergeWeeklyClusters(
      clusterGroups.map(({ clusters }) => clusters),
    ),
  };
}
