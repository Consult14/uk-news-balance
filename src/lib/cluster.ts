import { createHash } from "crypto";
import { NewsItem, NewsSourceId, SOURCE_ORDER, SOURCES_BY_LEAN, StoryCluster, PoliticalLean } from "./config";

const STOP_WORDS = new Set([
  "a",
  "about",
  "after",
  "again",
  "all",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "been",
  "before",
  "being",
  "both",
  "breaking",
  "but",
  "by",
  "can",
  "could",
  "did",
  "do",
  "does",
  "each",
  "few",
  "for",
  "from",
  "had",
  "has",
  "have",
  "he",
  "her",
  "here",
  "how",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "just",
  "live",
  "may",
  "more",
  "most",
  "must",
  "new",
  "no",
  "nor",
  "not",
  "now",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "our",
  "out",
  "over",
  "own",
  "pm",
  "said",
  "says",
  "say",
  "same",
  "shall",
  "she",
  "should",
  "so",
  "some",
  "such",
  "than",
  "that",
  "the",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "to",
  "too",
  "uk",
  "under",
  "update",
  "updates",
  "up",
  "very",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "why",
  "will",
  "with",
  "would",
  "you",
  "your",
]);

const TITLE_PREFIX = /^(live|breaking|watch|video|analysis|explained|in full)\s*:\s*/i;
const SOURCE_PREFIX =
  /^(bbc news|the guardian|the independent|daily mail|sky news)\s*[-–:]\s*/i;

const SIMILARITY_THRESHOLD = 0.55;
const MAX_TIME_DIFF_MS = 24 * 60 * 60 * 1000;

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(TITLE_PREFIX, "")
    .replace(SOURCE_PREFIX, "")
    .replace(/['']/g, "'")
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(title: string): Set<string> {
  return new Set(
    normalizeTitle(title)
      .split(" ")
      .filter((token) => token.length > 2 && !STOP_WORDS.has(token)),
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;

  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }

  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function sharedSignificantTokens(a: Set<string>, b: Set<string>): number {
  let count = 0;
  for (const token of a) {
    if (b.has(token) && token.length > 3) count += 1;
  }
  return count;
}

function itemsAreSameStory(a: NewsItem, b: NewsItem): boolean {
  const timeDiff = Math.abs(
    new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
  );
  if (timeDiff > MAX_TIME_DIFF_MS) return false;

  const tokensA = tokenize(a.title);
  const tokensB = tokenize(b.title);
  const similarity = jaccardSimilarity(tokensA, tokensB);

  if (similarity >= SIMILARITY_THRESHOLD) return true;

  if (similarity >= 0.4 && sharedSignificantTokens(tokensA, tokensB) >= 2) {
    return true;
  }

  return false;
}

function sortItemsBySource(items: NewsItem[]): NewsItem[] {
  const order = new Map(SOURCE_ORDER.map((sourceId, index) => [sourceId, index]));

  return [...items].sort(
    (a, b) =>
      (order.get(a.source.id) ?? 99) - (order.get(b.source.id) ?? 99),
  );
}

function pickCanonicalTitle(items: NewsItem[]): string {
  return items.reduce((best, item) =>
    item.title.length > best.length ? item.title : best,
  items[0].title);
}

function makeClusterId(items: NewsItem[]): string {
  const normalized = normalizeTitle(pickCanonicalTitle(items));
  const dateBucket = new Date(
    Math.max(...items.map((item) => new Date(item.publishedAt).getTime())),
  )
    .toISOString()
    .slice(0, 10);

  return createHash("sha256")
    .update(`${normalized}:${dateBucket}`)
    .digest("base64url")
    .slice(0, 12);
}

function makeCluster(items: NewsItem[]): StoryCluster {
  const sortedItems = sortItemsBySource(items);
  const publishedAt = sortedItems.reduce((latest, item) =>
    new Date(item.publishedAt).getTime() > new Date(latest).getTime()
      ? item.publishedAt
      : latest,
  sortedItems[0].publishedAt);

  return {
    id: makeClusterId(sortedItems),
    canonicalTitle: pickCanonicalTitle(sortedItems),
    items: sortedItems,
    publishedAt,
    sourceCount: sortedItems.length,
  };
}

export function clusterStories(items: NewsItem[]): StoryCluster[] {
  const sortedItems = [...items].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const clusters: StoryCluster[] = [];
  const assigned = new Set<string>();

  for (const item of sortedItems) {
    if (assigned.has(item.id)) continue;

    const group = [item];
    assigned.add(item.id);

    for (const candidate of sortedItems) {
      if (assigned.has(candidate.id)) continue;
      if (group.some((member) => itemsAreSameStory(member, candidate))) {
        group.push(candidate);
        assigned.add(candidate.id);
      }
    }

    clusters.push(makeCluster(group));
  }

  return clusters.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function filterClustersBySource(
  clusters: StoryCluster[],
  sourceId: NewsSourceId | "all",
): StoryCluster[] {
  if (sourceId === "all") return clusters;

  return clusters
    .map((cluster) => {
      const items = cluster.items.filter((item) => item.source.id === sourceId);
      if (items.length === 0) return null;
      return makeCluster(items);
    })
    .filter((cluster): cluster is StoryCluster => cluster !== null);
}

export function filterClustersByLean(
  clusters: StoryCluster[],
  lean: PoliticalLean | "all",
): StoryCluster[] {
  if (lean === "all") return clusters;

  const sourceIds = new Set(SOURCES_BY_LEAN[lean]);

  return clusters
    .map((cluster) => {
      const items = cluster.items.filter((item) => sourceIds.has(item.source.id));
      if (items.length === 0) return null;
      return makeCluster(items);
    })
    .filter((cluster): cluster is StoryCluster => cluster !== null);
}
