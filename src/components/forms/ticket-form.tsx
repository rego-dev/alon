"use client";

import * as React from "react";
import { CircleCheck, Paperclip, Send, TriangleAlert } from "lucide-react";
import { ticketSchema, fieldErrors } from "@/lib/validation";
import { Card, Field, Input, Select, Textarea } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

const SEVERITIES = [
  { value: "question", label: "Question — no impact" },
  { value: "low", label: "Low — minor inconvenience" },
  { value: "normal", label: "Normal — a workflow is affected" },
  { value: "high", label: "High — a team is blocked" },
  { value: "production-down", label: "Production down — we cannot trade" },
];

export function TicketForm({ products }: { products?: Array<{ slug: string; name: string }> }) {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle");
  const [reference, setReference] = React.useState<string | null>(null);

  const options = products ?? [
    { slug: "grocery-pos", name: "Grocery POS" },
    { slug: "accounting-software", name: "Accounting Software" },
    { slug: "payroll", name: "Payroll" },
    { slug: "clinic-management", name: "Clinic Management" },
    { slug: "inventory-management", name: "Inventory Management" },
    { slug: "school-management", name: "School Management" },
    { slug: "other", name: "Something else" },
  ];

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const raw = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      organisation: String(form.get("organisation") ?? ""),
      product: String(form.get("product") ?? ""),
      version: String(form.get("version") ?? ""),
      severity: String(form.get("severity") ?? "normal"),
      subject: String(form.get("subject") ?? ""),
      message: String(form.get("message") ?? ""),
      consent: form.get("consent") === "on",
    };

    const parsed = ticketSchema.safeParse(raw);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const body = (await response.json()) as { reference?: string };
      setReference(body.reference ?? null);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <Card className="p-8 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--success-soft)] text-[var(--success)]">
          <CircleCheck className="size-7" aria-hidden />
        </span>
        <h3 className="mt-5 text-xl font-semibold">Ticket received</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm text-[var(--muted-foreground)]">
          {reference ? (
            <>
              Your reference is <span className="font-mono font-medium text-[var(--foreground)]">{reference}</span>. We
              have emailed a copy and will reply within your plan&rsquo;s response target.
            </>
          ) : (
            <>We have emailed a copy and will reply within your plan&rsquo;s response target.</>
          )}
        </p>
        <Button variant="secondary" className="mt-6" onClick={() => setStatus("idle")}>
          Open another ticket
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8">
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" required htmlFor="t-name" hint={errors.name}>
            <Input id="t-name" name="name" autoComplete="name" aria-invalid={Boolean(errors.name)} />
          </Field>
          <Field label="Work email" required htmlFor="t-email" hint={errors.email}>
            <Input id="t-email" name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Organisation" required htmlFor="t-org" hint={errors.organisation}>
            <Input id="t-org" name="organisation" autoComplete="organization" aria-invalid={Boolean(errors.organisation)} />
          </Field>
          <Field label="Product" required htmlFor="t-product" hint={errors.product}>
            <Select id="t-product" name="product" defaultValue="" aria-invalid={Boolean(errors.product)}>
              <option value="" disabled>
                Choose a product
              </option>
              {options.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Version" htmlFor="t-version" hint="Found under Help → About">
            <Input id="t-version" name="version" placeholder="12.4.2" />
          </Field>
          <Field label="Severity" required htmlFor="t-severity" hint={errors.severity}>
            <Select id="t-severity" name="severity" defaultValue="normal">
              {SEVERITIES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Subject" required htmlFor="t-subject" hint={errors.subject}>
          <Input id="t-subject" name="subject" placeholder="Receipt printer stops after shift change" aria-invalid={Boolean(errors.subject)} />
        </Field>

        <Field
          label="What happened?"
          required
          htmlFor="t-message"
          hint={errors.message ?? "What you expected, what happened instead, and the steps to reproduce it."}
        >
          <Textarea id="t-message" name="message" rows={6} aria-invalid={Boolean(errors.message)} />
        </Field>

        <div className="flex items-center gap-2 rounded-xl border border-dashed border-[var(--border-strong)] p-4 text-sm text-[var(--muted-foreground)]">
          <Paperclip className="size-4 shrink-0" aria-hidden />
          Attach a diagnostics bundle after submitting — the confirmation email contains a secure upload link.
        </div>

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="consent"
            className="mt-0.5 size-4 rounded border-[var(--border-strong)] accent-[var(--primary)]"
          />
          <span className="text-[var(--muted-foreground)]">
            I understand this ticket and any attachments will be stored against my organisation&rsquo;s support history.
          </span>
        </label>
        {errors.consent ? (
          <p className="flex items-center gap-2 text-sm text-[var(--danger)]">
            <TriangleAlert className="size-4" aria-hidden />
            {errors.consent}
          </p>
        ) : null}

        {status === "error" ? (
          <p className="flex items-center gap-2 rounded-lg bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)]">
            <TriangleAlert className="size-4 shrink-0" aria-hidden />
            Something went wrong submitting the ticket. Email support directly and we will pick it up.
          </p>
        ) : null}

        <Button type="submit" size="lg" className="w-full" disabled={status === "sending"}>
          <Send aria-hidden />
          {status === "sending" ? "Submitting…" : "Submit ticket"}
        </Button>
      </form>
    </Card>
  );
}
