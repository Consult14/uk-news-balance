import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { BRAND } from "@/lib/theme";

interface SiteHeaderProps {
  children?: ReactNode;
}

export function SiteHeader({ children }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-navy/10 bg-white/95 backdrop-blur">
      <div className="px-4 py-3">
        <Link
          href="/politics"
          className="inline-block transition-opacity hover:opacity-90"
        >
          <Image
            src="/logo.png"
            alt={`${BRAND.name} — ${BRAND.tagline}`}
            width={280}
            height={72}
            priority
            className="h-14 w-auto sm:h-16"
          />
        </Link>
        {children}
      </div>
    </header>
  );
}
