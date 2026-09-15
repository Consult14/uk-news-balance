import { ContactForm } from "@/components/ContactForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { BRAND } from "@/lib/theme";

export const metadata = {
  title: `Contact — ${BRAND.name}`,
  description: "Get in touch with the Balanced UK NEWS team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto min-h-dvh max-w-6xl pb-8">
      <SiteHeader>
        <div className="mt-3">
          <h1 className="text-xl font-bold text-brand-navy sm:text-2xl">
            ✉️ Contact
          </h1>
          <p className="mt-2 text-sm text-brand-navy/70">
            Questions, feedback, or bug reports — send us a message and
            we&apos;ll reply by email.
          </p>
        </div>
      </SiteHeader>

      <main className="px-4 py-5">
        <div className="mx-auto max-w-lg">
          <ContactForm />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
