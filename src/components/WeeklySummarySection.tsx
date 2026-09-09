import { StoryCluster } from "@/lib/config";
import { getWeekRangeLabel } from "@/lib/weekly";
import { GroupedStoryCard } from "./GroupedStoryCard";

interface WeeklySummarySectionProps {
  clusters: StoryCluster[];
  digest: string;
}

export function WeeklySummarySection({
  clusters,
  digest,
}: WeeklySummarySectionProps) {
  const weekRange = getWeekRangeLabel();
  const topStories = [...clusters]
    .sort((a, b) => b.sourceCount - a.sourceCount)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-indigo-50 to-white p-5 ring-1 ring-indigo-100">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          {weekRange}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">{digest}</p>
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
