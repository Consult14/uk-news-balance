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
      <section className="rounded-2xl bg-gradient-to-br from-brand-light to-white p-5 ring-1 ring-brand-blue/20">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-blue">
          Weekly Summary
        </h2>
        <ul className="mt-4 space-y-4">
          {categorySummaries.map((category) => (
            <li key={category.id} className="text-sm leading-relaxed text-brand-navy/80">
              <span className="font-semibold text-brand-navy">
                {category.icon} {category.name}
              </span>
              <span className="text-brand-navy/50"> — </span>
              {category.digest}
            </li>
          ))}
        </ul>
      </section>

      {topStories.length > 0 ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-navy/50">
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
