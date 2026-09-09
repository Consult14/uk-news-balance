import { StoryCluster } from "@/lib/config";
import { getWeekRangeLabel } from "@/lib/weekly";
import { GroupedStoryCard } from "./GroupedStoryCard";
import { StoryFeed } from "./StoryFeed";

interface WeeklySummarySectionProps {
  clusters: StoryCluster[];
  digest: string;
  categoryLabel: string;
}

export function WeeklySummarySection({
  clusters,
  digest,
  categoryLabel,
}: WeeklySummarySectionProps) {
  const weekRange = getWeekRangeLabel();
  const crossOutletStories = clusters.filter(
    (cluster) => cluster.sourceCount >= 2,
  );
  const topStories = [...clusters]
    .sort((a, b) => b.sourceCount - a.sourceCount)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-indigo-50 to-white p-5 ring-1 ring-indigo-100">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          {weekRange}
        </p>
        <h2 className="mt-1 text-lg font-bold text-slate-900">
          Weekly summary — {categoryLabel}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">{digest}</p>
        <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-white/80 px-3 py-2 ring-1 ring-indigo-100">
            <dt className="text-xs text-slate-500">Stories</dt>
            <dd className="text-lg font-semibold text-slate-900">
              {clusters.length}
            </dd>
          </div>
          <div className="rounded-xl bg-white/80 px-3 py-2 ring-1 ring-indigo-100">
            <dt className="text-xs text-slate-500">Cross-outlet</dt>
            <dd className="text-lg font-semibold text-slate-900">
              {crossOutletStories.length}
            </dd>
          </div>
          <div className="rounded-xl bg-white/80 px-3 py-2 ring-1 ring-indigo-100">
            <dt className="text-xs text-slate-500">Window</dt>
            <dd className="text-lg font-semibold text-slate-900">7 days</dd>
          </div>
        </dl>
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

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
          All stories this week
        </h3>
        <StoryFeed clusters={clusters} />
      </section>
    </div>
  );
}
