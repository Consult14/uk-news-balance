import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Contact — UK News Balance",
  description: "Get in touch with the UK News Balance team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto min-h-dvh max-w-6xl pb-8">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-slate-100/90 backdrop-blur">
        <div className="px-4 py-4">
          <div className="mb-1">
            <Link
              href="/politics"
              className="text-xs font-medium uppercase tracking-wider text-slate-500 hover:text-slate-700"
            >
              UK News Balance
            </Link>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              ✉️ Contact
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            Questions, feedback, or bug reports — send us a message and
            we&apos;ll reply by email.
          </p>
        </div>
      </header>

      <main className="px-4 py-5">
        <div className="mx-auto max-w-lg">
          <ContactForm />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
