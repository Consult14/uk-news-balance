import { CategoryNav } from "@/components/CategoryNav";
import { WeeklySummarySection } from "@/components/WeeklySummarySection";
import { buildWeeklyDigest, fetchWeeklySummary } from "@/lib/weekly";

export const revalidate = 1800;

export const metadata = {
  title: "Weekly Summary — UK News Balance",
  description:
    "A rolling 7-day digest of headlines across BBC, Guardian, Independent, Daily Mail, and Sky",
};

export default async function WeeklySummaryPage() {
  const clusters = await fetchWeeklySummary("all");
  const digest = buildWeeklyDigest(clusters);

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
              <p>Updated {fetchedAt}</p>
            </div>
          </div>
          <p className="mb-3 text-sm text-slate-600">
            A rolling 7-day digest of headlines grouped across BBC, Guardian,
            Independent, Daily Mail, and Sky.
          </p>
          <CategoryNav activeId="weekly-summary" />
        </div>
      </header>

      <main className="px-4 py-5">
        <WeeklySummarySection clusters={clusters} digest={digest} />
      </main>

      <footer className="hidden px-4 py-8 text-center text-xs text-slate-500 md:block">
        Headlines and snippets © respective publishers. Personal, non-commercial
        use via public RSS feeds.
      </footer>
    </div>
  );
}
