import { notFound } from "next/navigation";
import { CategoryNav } from "@/components/CategoryNav";
import { SourceColumn, SOURCE_ORDER } from "@/components/NewsCard";
import { SourceNav } from "@/components/SourceNav";
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
  if (!category) return { title: "UK News Balance" };

  return {
    title: `${category.name} — UK News Balance`,
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
    <div className="mx-auto min-h-dvh max-w-6xl pb-8">
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
              <p>{storyCount} stories</p>
              <p>Updated {fetchedAt}</p>
            </div>
          </div>
          <p className="mb-3 text-sm text-slate-600">{category.description}</p>
          <CategoryNav activeId={category.id} activeSourceId={activeSource} />
          <SourceNav categoryId={category.id} activeSourceId={activeSource} />
        </div>
      </header>

      <main className="px-4 py-5">
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

      <footer className="hidden px-4 py-8 text-center text-xs text-slate-500 md:block">
        Headlines and snippets © respective publishers. Personal, non-commercial
        use via public RSS feeds.
      </footer>
    </div>
  );
}
