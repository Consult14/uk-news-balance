import { StoryCluster } from "@/lib/config";
import { CategoryWeeklySummary } from "@/lib/weekly";
import { GroupedStoryCard } from "./GroupedStoryCard";

interface WeeklySummarySectionProps {
  categorySummaries: CategoryWeeklySummary[];
  clusters: StoryCluster[];
}

export function WeeklySummarySection({
  categorySummaries,
  clusters,
}: WeeklySummarySectionProps) {
  const topStories = [...clusters]
    .sort((a, b) => b.sourceCount - a.sourceCount)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-indigo-50 to-white p-5 ring-1 ring-indigo-100">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Weekly Summary
        </h2>
        <ul className="mt-4 space-y-4">
          {categorySummaries.map((category) => (
            <li key={category.id} className="text-sm leading-relaxed text-slate-700">
              <span className="font-semibold text-slate-900">
                {category.icon} {category.name}
              </span>
              <span className="text-slate-500"> — </span>
              {category.digest}
            </li>
          ))}
        </ul>
      </section>

      {topStories.length > 0 ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Top stories this week
          </h3>
          <ul className="grid gap-4 md:grid-cols-2">
            {topStories.map((cluster) => (
              <li key={`top-${cluster.id}`}>
                <GroupedStoryCard cluster={cluster} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
