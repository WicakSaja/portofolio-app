"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveContact } from "@/lib/actions/contact";
import { contactFormSchema } from "@/lib/validations/contact";
import type { ContactFormValues } from "@/types/contact";

interface Contact {
  id: string;
  email: string;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
}

interface ContactFormProps {
  contact?: Contact | null;
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-white/35";

export function ContactForm({ contact }: ContactFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: contact?.email ?? "",
      phone: contact?.phone ?? "",
      linkedin: contact?.linkedin ?? "",
      github: contact?.github ?? "",
    },
  });

  const onSubmit = (values: ContactFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("phone", values.phone ?? "");
      formData.append("linkedin", values.linkedin ?? "");
      formData.append("github", values.github ?? "");

      const result = await saveContact(formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="email" className="text-sm text-slate-200">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="e.g. developer@example.com"
          {...form.register("email")}
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-rose-300">{form.formState.errors.email?.message}</p>
      </div>

      <div>
        <label htmlFor="phone" className="text-sm text-slate-200">
          Phone Number <span className="text-slate-400">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="e.g. +1 (555) 019-2834"
          {...form.register("phone")}
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-rose-300">{form.formState.errors.phone?.message}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="linkedin" className="text-sm text-slate-200">
            LinkedIn Profile URL <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/username"
            {...form.register("linkedin")}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.linkedin?.message}</p>
        </div>

        <div>
          <label htmlFor="github" className="text-sm text-slate-200">
            GitHub Profile URL <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="github"
            type="url"
            placeholder="https://github.com/username"
            {...form.register("github")}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.github?.message}</p>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save Contact Info"}
        </button>
      </div>
    </form>
  );
}
