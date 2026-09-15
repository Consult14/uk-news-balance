import { CategoryNav } from "@/components/CategoryNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WeeklySummarySection } from "@/components/WeeklySummarySection";
import { fetchWeeklySummariesByCategory } from "@/lib/weekly";
import { BRAND } from "@/lib/theme";

export const revalidate = 1800;

export const metadata = {
  title: `Weekly Summary — ${BRAND.name}`,
  description:
    "A rolling 7-day digest of headlines across BBC, Guardian, Independent, Daily Mail, and Sky",
};

export default async function WeeklySummaryPage() {
  const { categorySummaries, allClusters } =
    await fetchWeeklySummariesByCategory();

  const fetchedAt = new Date().toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto min-h-dvh max-w-6xl pb-8">
      <SiteHeader>
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-brand-navy sm:text-2xl">
                📅 Weekly Summary
              </h1>
            </div>
            <div className="text-right text-xs text-brand-navy/60">
              <p>Updated {fetchedAt}</p>
            </div>
          </div>
          <p className="mb-3 text-sm text-brand-navy/70">
            A rolling 7-day digest of headlines grouped across BBC, Guardian,
            Independent, Daily Mail, and Sky.
          </p>
          <CategoryNav activeId="weekly-summary" />
        </div>
      </SiteHeader>

      <main className="px-4 py-5">
        <WeeklySummarySection
          categorySummaries={categorySummaries}
          clusters={allClusters}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
