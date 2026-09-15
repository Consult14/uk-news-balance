import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="px-4 py-8 text-center text-xs text-brand-navy/50">
      <p>
        <Link
          href="/contact"
          className="text-sm font-medium text-brand-navy/70 underline-offset-2 hover:underline"
        >
          Contact Us
        </Link>
      </p>
      <p className="mt-2">
        Headlines and snippets © respective publishers. Personal, non-commercial
        use via public RSS feeds.
      </p>
    </footer>
  );
}
