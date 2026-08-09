import { prisma } from "@/lib/db/prisma";
import { ContactForm } from "@/components/admin/contact-form";

export const dynamic = "force-dynamic";

export default async function ContactAdminPage() {
  const contact = await prisma.contact.findFirst();

  return (
    <div className="px-6 py-8 sm:px-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Contact Info</h2>
        <p className="mt-1 text-sm text-slate-300">
          Manage your email address, phone number, and social profile links shown on the public site.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <ContactForm contact={contact} />
      </div>
    </div>
  );
}
