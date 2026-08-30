import { notFound } from "next/navigation";
import { BottomNav, CategoryNav } from "@/components/CategoryNav";
import { SourceColumn, SOURCE_ORDER } from "@/components/NewsCard";
import { SourceNav } from "@/components/SourceNav";
import { StoryFeed } from "@/components/StoryFeed";
import { ViewToggle } from "@/components/ViewToggle";
import { filterClustersBySource } from "@/lib/cluster";
import {
  CATEGORIES,
  CategoryId,
  getCategory,
  isNewsSourceId,
  NewsSourceId,
} from "@/lib/config";
import { fetchCategoryClusters, fetchCategoryNews } from "@/lib/rss";
import { isViewMode, ViewMode } from "@/lib/url";

export const revalidate = 1800;

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ source?: string; view?: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category: categoryId } = await params;
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return { title: "UK News Balance" };

  return {
    title: `${category.name} — UK News Balance`,
    description: category.description,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category: categoryId } = await params;
  const { source: sourceParam, view: viewParam } = await searchParams;
  const isValid = CATEGORIES.some((c) => c.id === categoryId);
  if (!isValid) notFound();

  const activeSource: NewsSourceId | "all" =
    sourceParam && isNewsSourceId(sourceParam) ? sourceParam : "all";

  const activeView: ViewMode =
    viewParam && isViewMode(viewParam) ? viewParam : "grouped";

  const visibleSources =
    activeSource === "all" ? SOURCE_ORDER : [activeSource];

  const category = getCategory(categoryId as CategoryId);

  const [itemsBySource, clusters] = await Promise.all([
    activeView === "columns"
      ? fetchCategoryNews(category.id, visibleSources)
      : Promise.resolve({} as Record<NewsSourceId, never[]>),
    activeView === "grouped"
      ? fetchCategoryClusters(category.id, SOURCE_ORDER)
      : Promise.resolve([]),
  ]);

  const visibleClusters =
    activeView === "grouped"
      ? filterClustersBySource(clusters, activeSource)
      : [];

  const fetchedAt = new Date().toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const storyCount =
    activeView === "grouped"
      ? visibleClusters.length
      : visibleSources.reduce(
          (sum, sourceId) => sum + (itemsBySource[sourceId]?.length ?? 0),
          0,
        );

  const introCopy =
    activeView === "grouped"
      ? "Stories grouped when outlets cover the same event. Swipe a card or tap the dots to switch between BBC, Guardian, Mail, and others."
      : "Headlines from five UK outlets side by side. Tap any story to read the full article on the original site.";

  return (
    <div className="mx-auto min-h-dvh max-w-6xl pb-24 md:pb-8">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-slate-100/90 backdrop-blur">
        <div className="px-4 py-4">
          <div className="mb-1 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                UK News Balance
              </p>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                {category.icon} {category.name}
              </h1>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>
                {storyCount}{" "}
                {activeView === "grouped" ? "story groups" : "stories"}
              </p>
              <p>Updated {fetchedAt}</p>
            </div>
          </div>
          <p className="mb-3 text-sm text-slate-600">{category.description}</p>
          <CategoryNav
            activeId={category.id}
            activeSourceId={activeSource}
            activeView={activeView}
          />
          <SourceNav
            categoryId={category.id}
            activeSourceId={activeSource}
            activeView={activeView}
          />
          <ViewToggle
            categoryId={category.id}
            activeView={activeView}
            activeSourceId={activeSource}
          />
        </div>
      </header>

      <main className="px-4 py-5">
        <p className="mb-5 rounded-xl bg-white px-4 py-3 text-sm leading-relaxed text-slate-600 ring-1 ring-slate-200">
          {introCopy}
        </p>

        {activeView === "grouped" ? (
          <StoryFeed clusters={visibleClusters} />
        ) : (
          <div
            className={`grid gap-5 ${
              visibleSources.length === 1
                ? "max-w-xl"
                : "md:grid-cols-2 xl:grid-cols-3"
            }`}
          >
            {visibleSources.map((sourceId) => (
              <SourceColumn
                key={sourceId}
                sourceId={sourceId}
                items={itemsBySource[sourceId] ?? []}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="hidden px-4 py-8 text-center text-xs text-slate-500 md:block">
        Headlines and snippets © respective publishers. Personal, non-commercial
        use via public RSS feeds.
      </footer>

      <BottomNav
        activeId={category.id}
        activeSourceId={activeSource}
        activeView={activeView}
      />
    </div>
  );
}
