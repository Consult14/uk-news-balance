import { CategoryNav, CategoryNavId } from "./CategoryNav";
import { SourceNav } from "./SourceNav";
import { CategoryId, NewsSourceId } from "@/lib/config";
import { SectionHeader } from "./SectionHeader";

interface PageToolbarProps {
  icon: string;
  title: string;
  description: string;
  updatedAt: string;
  storyCount?: number;
  activeCategoryId: CategoryNavId;
  activeSourceId?: NewsSourceId | "all";
  showSourceNav?: boolean;
}

export function PageToolbar({
  icon,
  title,
  description,
  updatedAt,
  storyCount,
  activeCategoryId,
  activeSourceId = "all",
  showSourceNav = true,
}: PageToolbarProps) {
  return (
    <div className="sticky top-[68px] z-40 border-b border-slate-200/70 bg-slate-50/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-5 lg:px-6">
        <SectionHeader
          icon={icon}
          title={title}
          description={description}
          storyCount={storyCount}
          updatedAt={updatedAt}
        />

        <div className="space-y-2 pb-3">
          <CategoryNav
            activeId={activeCategoryId}
            activeSourceId={activeSourceId}
          />
          {showSourceNav && activeCategoryId !== "weekly-summary" ? (
            <SourceNav
              categoryId={activeCategoryId as CategoryId}
              activeSourceId={activeSourceId}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
