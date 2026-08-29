import Parser from "rss-parser";
import {
  CategoryId,
  NewsItem,
  NewsSourceId,
  NEWS_SOURCES,
  getFeedUrl,
} from "./config";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "UKNewsBalance/1.0 (personal news aggregator)",
  },
});

const ITEMS_PER_SOURCE = 5;

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function makeItemId(link: string, source: NewsSourceId): string {
  return `${source}-${Buffer.from(link).toString("base64url").slice(0, 24)}`;
}

export async function fetchSourceFeed(
  category: CategoryId,
  sourceId: NewsSourceId,
): Promise<NewsItem[]> {
  const url = getFeedUrl(category, sourceId);
  const source = NEWS_SOURCES[sourceId];

  try {
    const feed = await parser.parseURL(url);

    return (feed.items ?? [])
      .filter((item) => item.title && item.link)
      .slice(0, ITEMS_PER_SOURCE)
      .map((item) => ({
        id: makeItemId(item.link!, sourceId),
        title: item.title!.trim(),
        link: item.link!,
        summary: stripHtml(item.contentSnippet ?? item.content ?? "").slice(
          0,
          220,
        ),
        publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
        source,
        category,
      }));
  } catch (error) {
    console.error(`Failed to fetch ${sourceId} (${category}):`, error);
    return [];
  }
}

export async function fetchCategoryNews(
  category: CategoryId,
  sourceIds: NewsSourceId[],
): Promise<Record<NewsSourceId, NewsItem[]>> {
  const results = await Promise.all(
    sourceIds.map(async (sourceId) => ({
      sourceId,
      items: await fetchSourceFeed(category, sourceId),
    })),
  );

  return results.reduce(
    (acc, { sourceId, items }) => {
      acc[sourceId] = items;
      return acc;
    },
    {} as Record<NewsSourceId, NewsItem[]>,
  );
}
