import Link from "next/link";

interface BrandLogoProps {
  compact?: boolean;
  className?: string;
}

export function BrandLogo({ compact = true, className = "" }: BrandLogoProps) {
  return (
    <Link
      href="/politics"
      className={`group inline-flex shrink-0 items-center gap-2.5 ${className}`}
      aria-label="Balanced UK News — home"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={compact ? "h-9 w-9 shrink-0" : "h-11 w-11 shrink-0"}
        aria-hidden
      >
        <rect x="4" y="28" width="40" height="4" rx="1" fill="#0f172a" />
        <rect x="8" y="32" width="32" height="3" rx="1" fill="#1e3a5f" />
        <rect x="14" y="18" width="4" height="10" fill="#0f172a" />
        <rect x="30" y="18" width="4" height="10" fill="#0f172a" />
        <path d="M10 18 L24 8 L38 18" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
        <rect x="20" y="8" width="8" height="3" rx="0.5" fill="#2563eb" />
        <line x1="24" y1="11" x2="24" y2="18" stroke="#0f172a" strokeWidth="2" />
        <line x1="16" y1="22" x2="32" y2="22" stroke="#64748b" strokeWidth="1.5" />
        <circle cx="16" cy="24" r="3" fill="#dc2626" />
        <circle cx="32" cy="24" r="3" fill="#16a34a" />
        <path d="M16 27 L16 30 M32 27 L32 30" stroke="#64748b" strokeWidth="1.5" />
        <rect x="22" y="35" width="4" height="8" fill="#2563eb" />
      </svg>
      <div className="min-w-0 leading-tight">
        <span className="block text-[15px] font-bold tracking-tight text-slate-900 group-hover:text-blue-800 sm:text-[17px]">
          Balanced UK News
        </span>
        {!compact ? (
          <span className="block text-xs text-slate-500">Updated every hour.</span>
        ) : null}
      </div>
    </Link>
  );
}
