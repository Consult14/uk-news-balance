import { notFound } from "next/navigation";
import { SourceNav } from "@/components/SourceNav";
import { ViewModeNav } from "@/components/ViewModeNav";
import { WeeklyCategoryNav } from "@/components/WeeklyCategoryNav";
import { WeeklySummarySection } from "@/components/WeeklySummarySection";
import {
  CATEGORIES,
  CategoryId,
  getCategory,
  isNewsSourceId,
  NewsSourceId,
  SOURCE_ORDER,
} from "@/lib/config";
import { filterClustersBySource } from "@/lib/cluster";
import {
  buildWeeklyDigest,
  fetchWeeklySummary,
  isWeeklyCategoryId,
  WeeklyCategoryId,
} from "@/lib/weekly";

export const revalidate = 1800;

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ source?: string }>;
}

const ALL_CATEGORY_LABEL = "All News";

export function generateStaticParams() {
  return [
    { category: "all" },
    ...CATEGORIES.map((category) => ({ category: category.id })),
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { category: categoryId } = await params;
  if (!isWeeklyCategoryId(categoryId)) {
    return { title: "UK News Balance" };
  }

  const label =
    categoryId === "all"
      ? ALL_CATEGORY_LABEL
      : CATEGORIES.find((category) => category.id === categoryId)?.name ??
        "Weekly Summary";

  return {
    title: `${label} Weekly Summary — UK News Balance`,
    description: `Weekly digest of ${label.toLowerCase()} headlines across UK outlets`,
  };
}

function getCategoryLabel(categoryId: WeeklyCategoryId): string {
  if (categoryId === "all") return ALL_CATEGORY_LABEL;
  return getCategory(categoryId).name;
}

function getNavCategoryId(categoryId: WeeklyCategoryId): CategoryId {
  if (categoryId === "all") return "politics";
  return categoryId;
}

export default async function WeeklySummaryPage({
  params,
  searchParams,
}: PageProps) {
  const { category: categoryParam } = await params;
  const { source: sourceParam } = await searchParams;

  if (!isWeeklyCategoryId(categoryParam)) notFound();

  const categoryId = categoryParam as WeeklyCategoryId;
  const activeSource: NewsSourceId | "all" =
    sourceParam && isNewsSourceId(sourceParam) ? sourceParam : "all";

  const fetchSources =
    activeSource === "all" ? SOURCE_ORDER : [activeSource];

  const clusters = await fetchWeeklySummary(categoryId, fetchSources);
  const filteredClusters = filterClustersBySource(clusters, activeSource);
  const digest = buildWeeklyDigest(filteredClusters);
  const categoryLabel = getCategoryLabel(categoryId);
  const navCategoryId = getNavCategoryId(categoryId);

  const fetchedAt = new Date().toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

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
                📅 Weekly Summary
              </h1>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>{filteredClusters.length} stories</p>
              <p>Updated {fetchedAt}</p>
            </div>
          </div>
          <p className="mb-3 text-sm text-slate-600">
            A rolling 7-day digest of headlines grouped across BBC, Guardian,
            Independent, Daily Mail, and Sky.
          </p>
          <ViewModeNav
            activeMode="weekly"
            categoryId={navCategoryId}
            weeklyCategoryId={categoryId}
            activeSourceId={activeSource}
          />
          <WeeklyCategoryNav
            activeId={categoryId}
            activeSourceId={activeSource}
          />
          <SourceNav
            categoryId={navCategoryId}
            activeSourceId={activeSource}
            viewMode="weekly"
            weeklyCategoryId={categoryId}
          />
        </div>
      </header>

      <main className="px-4 py-5">
        <WeeklySummarySection
          clusters={filteredClusters}
          digest={digest}
          categoryLabel={categoryLabel}
        />
      </main>

      <footer className="hidden px-4 py-8 text-center text-xs text-slate-500 md:block">
        Headlines and snippets © respective publishers. Personal, non-commercial
        use via public RSS feeds.
      </footer>
    </div>
  );
}
