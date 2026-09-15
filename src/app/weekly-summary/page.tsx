import { GlobalHeader } from "@/components/GlobalHeader";
import { PageToolbar } from "@/components/PageToolbar";
import { WeeklySummarySection } from "@/components/WeeklySummarySection";
import { fetchWeeklySummariesByCategory } from "@/lib/weekly";

export const revalidate = 1800;

export const metadata = {
  title: "Weekly Summary — Balanced UK News",
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
    <div className="mx-auto min-h-dvh max-w-6xl pb-6">
      <GlobalHeader activeCategoryId="weekly-summary" />

      <PageToolbar
        icon="📅"
        title="Weekly Summary"
        description="A rolling 7-day digest of headlines grouped across BBC, Guardian, Independent, Daily Mail, and Sky."
        updatedAt={fetchedAt}
        activeCategoryId="weekly-summary"
        showSourceNav={false}
      />

      <main className="px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
        <WeeklySummarySection
          categorySummaries={categorySummaries}
          clusters={allClusters}
        />
      </main>

      <footer className="hidden px-4 py-6 text-center text-xs text-slate-500 sm:px-5 lg:px-6 md:block">
        Headlines and snippets © respective publishers. Personal, non-commercial
        use via public RSS feeds.
      </footer>
    </div>
  );
}
