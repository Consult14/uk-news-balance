import {
  LEAN_COLORS,
  LEAN_LABELS,
  NewsItem,
  NewsSourceId,
  NEWS_SOURCES,
  PoliticalLean,
  SOURCE_ORDER,
} from "@/lib/config";

interface SourceBadgeProps {
  name: string;
  color: string;
}

export function SourceBadge({ name, color }: SourceBadgeProps) {
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {name}
    </span>
  );
}

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

interface NewsCardProps {
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80 transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <SourceBadge name={item.source.shortName} color={item.source.color} />
        <time
          className="shrink-0 text-xs text-slate-500"
          dateTime={item.publishedAt}
        >
          {formatRelativeTime(item.publishedAt)}
        </time>
      </div>
      <h3 className="text-[15px] font-semibold leading-snug text-slate-900 group-hover:text-blue-700">
        {item.title}
      </h3>
      {item.summary ? (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {item.summary}
        </p>
      ) : null}
    </a>
  );
}

interface SourceColumnProps {
  sourceId: NewsSourceId;
  items: NewsItem[];
}

export function SourceColumn({ sourceId, items }: SourceColumnProps) {
  const source = items[0]?.source ?? NEWS_SOURCES[sourceId];

  return (
    <section className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <header className="mb-3 flex items-center justify-between gap-2">
        <SourceBadge name={source.shortName} color={source.color} />
        <span className="text-right text-xs text-slate-500">{source.lean}</span>
      </header>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">Feed temporarily unavailable</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <NewsCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

interface LeanColumnProps {
  lean: PoliticalLean;
  items: NewsItem[];
}

export function LeanColumn({ lean, items }: LeanColumnProps) {
  const sortedItems = [...items].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <section className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <header className="mb-3 flex items-center justify-between gap-2">
        <SourceBadge name={LEAN_LABELS[lean]} color={LEAN_COLORS[lean]} />
        <span className="text-right text-xs text-slate-500">
          {sortedItems.length} {sortedItems.length === 1 ? "story" : "stories"}
        </span>
      </header>
      {sortedItems.length === 0 ? (
        <p className="text-sm text-slate-500">No stories available</p>
      ) : (
        <ul className="space-y-3">
          {sortedItems.map((item) => (
            <li key={item.id}>
              <NewsCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export { SOURCE_ORDER };
