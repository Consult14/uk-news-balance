import { StoryCluster } from "@/lib/config";
import { GroupedStoryCard } from "./GroupedStoryCard";

interface StoryFeedProps {
  clusters: StoryCluster[];
}

export function StoryFeed({ clusters }: StoryFeedProps) {
  if (clusters.length === 0) {
    return (
      <p className="rounded-xl bg-white px-4 py-6 text-center text-sm text-slate-500 ring-1 ring-slate-200">
        No stories available right now. Feeds may be temporarily unavailable.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {clusters.map((cluster) => (
        <li key={cluster.id}>
          <GroupedStoryCard cluster={cluster} />
        </li>
      ))}
    </ul>
  );
}
