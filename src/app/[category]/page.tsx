import { notFound } from "next/navigation";
import { GlobalHeader } from "@/components/GlobalHeader";
import { PageToolbar } from "@/components/PageToolbar";
import { SourceColumn, SOURCE_ORDER } from "@/components/NewsCard";
import {
  CATEGORIES,
  CategoryId,
  getCategory,
  isNewsSourceId,
  NewsSourceId,
} from "@/lib/config";
import { fetchCategoryNews } from "@/lib/rss";

export const revalidate = 1800;

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ source?: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category: categoryId } = await params;
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return { title: "Balanced UK News" };

  return {
    title: `${category.name} — Balanced UK News`,
    description: category.description,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category: categoryId } = await params;
  const { source: sourceParam } = await searchParams;
  const isValid = CATEGORIES.some((c) => c.id === categoryId);
  if (!isValid) notFound();

  const activeSource: NewsSourceId | "all" =
    sourceParam && isNewsSourceId(sourceParam) ? sourceParam : "all";

  const category = getCategory(categoryId as CategoryId);
  const fetchSources =
    activeSource === "all" ? SOURCE_ORDER : [activeSource];
  const itemsBySource = await fetchCategoryNews(category.id, fetchSources);

  const fetchedAt = new Date().toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const storyCount =
    activeSource === "all"
      ? SOURCE_ORDER.reduce(
          (sum, sourceId) => sum + (itemsBySource[sourceId]?.length ?? 0),
          0,
        )
      : (itemsBySource[activeSource]?.length ?? 0);

  return (
    <div className="mx-auto min-h-dvh max-w-6xl pb-6">
      <GlobalHeader
        activeCategoryId={category.id}
        activeSourceId={activeSource}
      />

      <PageToolbar
        icon={category.icon}
        title={category.name}
        description={category.description}
        storyCount={storyCount}
        updatedAt={fetchedAt}
        activeCategoryId={category.id}
        activeSourceId={activeSource}
      />

      <main className="px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
        {activeSource === "all" ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {SOURCE_ORDER.map((sourceId) => (
              <SourceColumn
                key={sourceId}
                sourceId={sourceId}
                items={itemsBySource[sourceId] ?? []}
              />
            ))}
          </div>
        ) : (
          <div className="max-w-xl">
            <SourceColumn
              sourceId={activeSource}
              items={itemsBySource[activeSource] ?? []}
            />
          </div>
        )}
      </main>

      <footer className="hidden px-4 py-6 text-center text-xs text-slate-500 sm:px-5 lg:px-6 md:block">
        Headlines and snippets © respective publishers. Personal, non-commercial
        use via public RSS feeds.
      </footer>
    </div>
  );
}
