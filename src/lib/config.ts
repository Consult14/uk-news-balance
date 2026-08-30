export type NewsSourceId =
  | "bbc"
  | "guardian"
  | "dailymail"
  | "independent"
  | "sky";

export type CategoryId =
  | "politics"
  | "uk"
  | "world"
  | "business"
  | "sport"
  | "tech"
  | "health";

export interface NewsSource {
  id: NewsSourceId;
  name: string;
  shortName: string;
  color: string;
  lean: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
}

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  summary: string;
  publishedAt: string;
  source: NewsSource;
  category: CategoryId;
}

export interface StoryCluster {
  id: string;
  canonicalTitle: string;
  items: NewsItem[];
  publishedAt: string;
  sourceCount: number;
}

export interface CategoryFeed {
  category: Category;
  itemsBySource: Record<NewsSourceId, NewsItem[]>;
  clusters: StoryCluster[];
  fetchedAt: string;
}

export const NEWS_SOURCES: Record<NewsSourceId, NewsSource> = {
  bbc: {
    id: "bbc",
    name: "BBC News",
    shortName: "BBC",
    color: "#BB1919",
    lean: "Centre / public service",
  },
  guardian: {
    id: "guardian",
    name: "The Guardian",
    shortName: "Guardian",
    color: "#052962",
    lean: "Centre-left",
  },
  dailymail: {
    id: "dailymail",
    name: "Daily Mail",
    shortName: "Mail",
    color: "#004DB3",
    lean: "Right / popular press",
  },
  independent: {
    id: "independent",
    name: "The Independent",
    shortName: "Indy",
    color: "#ED1C24",
    lean: "Centre-left",
  },
  sky: {
    id: "sky",
    name: "Sky News",
    shortName: "Sky",
    color: "#0072C6",
    lean: "Centre / broadcast",
  },
};

export const CATEGORIES: Category[] = [
  {
    id: "politics",
    name: "Politics",
    description: "Westminster, elections, and policy",
    icon: "🏛️",
  },
  {
    id: "uk",
    name: "UK",
    description: "Domestic news across Britain",
    icon: "🇬🇧",
  },
  {
    id: "world",
    name: "World",
    description: "International headlines",
    icon: "🌍",
  },
  {
    id: "business",
    name: "Business",
    description: "Markets, economy, and companies",
    icon: "💼",
  },
  {
    id: "sport",
    name: "Sport",
    description: "Football, cricket, and more",
    icon: "⚽",
  },
  {
    id: "tech",
    name: "Tech",
    description: "Technology and innovation",
    icon: "💻",
  },
  {
    id: "health",
    name: "Health",
    description: "NHS, wellbeing, and science",
    icon: "🏥",
  },
];

const FEED_URLS: Record<CategoryId, Record<NewsSourceId, string>> = {
  politics: {
    bbc: "https://feeds.bbci.co.uk/news/politics/rss.xml",
    guardian: "https://www.theguardian.com/politics/rss",
    dailymail: "https://www.dailymail.co.uk/news/index.rss",
    independent: "https://www.independent.co.uk/news/uk/politics/rss",
    sky: "https://feeds.skynews.com/feeds/rss/politics.xml",
  },
  uk: {
    bbc: "https://feeds.bbci.co.uk/news/uk/rss.xml",
    guardian: "https://www.theguardian.com/uk-news/rss",
    dailymail: "https://www.dailymail.co.uk/news/index.rss",
    independent: "https://www.independent.co.uk/news/uk/rss",
    sky: "https://feeds.skynews.com/feeds/rss/uk.xml",
  },
  world: {
    bbc: "https://feeds.bbci.co.uk/news/world/rss.xml",
    guardian: "https://www.theguardian.com/world/rss",
    dailymail: "https://www.dailymail.co.uk/news/worldnews/index.rss",
    independent: "https://www.independent.co.uk/news/world/rss",
    sky: "https://feeds.skynews.com/feeds/rss/world.xml",
  },
  business: {
    bbc: "https://feeds.bbci.co.uk/news/business/rss.xml",
    guardian: "https://www.theguardian.com/uk/business/rss",
    dailymail: "https://www.dailymail.co.uk/money/index.rss",
    independent: "https://www.independent.co.uk/news/business/rss",
    sky: "https://feeds.skynews.com/feeds/rss/business.xml",
  },
  sport: {
    bbc: "https://feeds.bbci.co.uk/sport/rss.xml",
    guardian: "https://www.theguardian.com/uk/sport/rss",
    dailymail: "https://www.dailymail.co.uk/sport/index.rss",
    independent: "https://www.independent.co.uk/sport/rss",
    sky: "https://feeds.skynews.com/feeds/rss/home.xml",
  },
  tech: {
    bbc: "https://feeds.bbci.co.uk/news/technology/rss.xml",
    guardian: "https://www.theguardian.com/uk/technology/rss",
    dailymail: "https://www.dailymail.co.uk/sciencetech/index.rss",
    independent: "https://www.independent.co.uk/news/science/rss",
    sky: "https://feeds.skynews.com/feeds/rss/technology.xml",
  },
  health: {
    bbc: "https://feeds.bbci.co.uk/news/health/rss.xml",
    guardian: "https://www.theguardian.com/society/health/rss",
    dailymail: "https://www.dailymail.co.uk/health/index.rss",
    independent: "https://www.independent.co.uk/life-style/health-and-families/rss",
    sky: "https://feeds.skynews.com/feeds/rss/uk.xml",
  },
};

export function getFeedUrl(category: CategoryId, source: NewsSourceId): string {
  return FEED_URLS[category][source];
}

export function getCategory(id: CategoryId): Category {
  const category = CATEGORIES.find((c) => c.id === id);
  if (!category) throw new Error(`Unknown category: ${id}`);
  return category;
}

export const SOURCE_ORDER: NewsSourceId[] = [
  "bbc",
  "guardian",
  "independent",
  "dailymail",
  "sky",
];

export function isNewsSourceId(value: string): value is NewsSourceId {
  return value in NEWS_SOURCES;
}
