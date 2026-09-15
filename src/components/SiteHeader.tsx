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
      <div className="px-4 py-4">
        <div className="flex justify-center">
          <Link
            href="/politics"
            className="inline-block transition-opacity hover:opacity-90"
          >
            <Image
              src="/logo.png"
              alt={`${BRAND.name} — ${BRAND.tagline}`}
              width={420}
              height={108}
              priority
              className="h-20 w-auto sm:h-24"
            />
          </Link>
        </div>
        {children}
      </div>
    </header>
  );
}
