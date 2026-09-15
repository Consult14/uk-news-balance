import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="px-4 py-8 text-center text-xs text-slate-500">
      <p>
        <Link
          href="/contact"
          className="font-medium text-slate-600 underline-offset-2 hover:underline"
        >
          Contact
        </Link>
      </p>
      <p className="mt-2">
        Headlines and snippets © respective publishers. Personal, non-commercial
        use via public RSS feeds.
      </p>
    </footer>
  );
}
