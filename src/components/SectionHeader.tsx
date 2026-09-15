interface SectionHeaderProps {
  icon: string;
  title: string;
  description: string;
  storyCount?: number;
  updatedAt: string;
}

export function SectionHeader({
  icon,
  title,
  description,
  storyCount,
  updatedAt,
}: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 sm:py-3.5">
      <div className="min-w-0">
        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[28px]">
          <span aria-hidden className="mr-1.5">
            {icon}
          </span>
          {title}
        </h1>
        <p className="mt-0.5 text-sm leading-snug text-slate-600 sm:text-[15px]">
          {description}
        </p>
      </div>

      <div className="shrink-0 text-right text-xs leading-relaxed text-slate-500 sm:text-[13px]">
        {storyCount !== undefined ? (
          <>
            <p className="font-medium text-slate-700 sm:hidden">
              {storyCount} stories · Updated{" "}
              {updatedAt.includes(",")
                ? updatedAt.split(", ").slice(1).join(", ").trim()
                : updatedAt}
            </p>
            <p className="hidden font-medium text-slate-700 sm:block">
              {storyCount} stories
            </p>
          </>
        ) : null}
        <p className={storyCount !== undefined ? "hidden sm:block" : ""}>
          Updated {updatedAt}
        </p>
      </div>
    </div>
  );
}
