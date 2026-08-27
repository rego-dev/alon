"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { CircleCheck, Send, TriangleAlert } from "lucide-react";
import { contactSchema, fieldErrors } from "@/lib/validation";
import { Card, Field, Input, Select, Textarea } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

const TOPICS = [
  { value: "sales", label: "Sales — pricing, demo or a quote" },
  { value: "support", label: "Technical support" },
  { value: "billing", label: "Billing and invoices" },
  { value: "partnership", label: "Partnership or reselling" },
  { value: "other", label: "Something else" },
];

const SIZES = [
  { value: "1-9", label: "1–9 employees" },
  { value: "10-49", label: "10–49 employees" },
  { value: "50-199", label: "50–199 employees" },
  { value: "200-999", label: "200–999 employees" },
  { value: "1000+", label: "1,000+ employees" },
];

export function ContactForm() {
  const params = useSearchParams();
  const topicParam = params.get("topic");
  const defaultTopic = TOPICS.some((t) => t.value === topicParam) ? topicParam! : "sales";

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const raw = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      company: String(form.get("company") ?? ""),
      phone: String(form.get("phone") ?? ""),
      topic: String(form.get("topic") ?? "sales"),
      employees: String(form.get("employees") ?? "10-49"),
      message: String(form.get("message") ?? ""),
      consent: form.get("consent") === "on",
    };

    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
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
        <h3 className="mt-5 text-xl font-semibold">Message sent</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm text-[var(--muted-foreground)]">
          Thanks — someone from the right team will reply, usually within one business hour. Sales enquiries during
          business hours are often answered in minutes.
        </p>
        <Button variant="secondary" className="mt-6" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8">
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" required htmlFor="c-name" hint={errors.name}>
            <Input id="c-name" name="name" autoComplete="name" aria-invalid={Boolean(errors.name)} />
          </Field>
          <Field label="Work email" required htmlFor="c-email" hint={errors.email}>
            <Input id="c-email" name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Company" required htmlFor="c-company" hint={errors.company}>
            <Input id="c-company" name="company" autoComplete="organization" aria-invalid={Boolean(errors.company)} />
          </Field>
          <Field label="Phone" htmlFor="c-phone" hint="Optional — useful for sales calls">
            <Input id="c-phone" name="phone" type="tel" autoComplete="tel" />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="What is this about?" required htmlFor="c-topic">
            <Select id="c-topic" name="topic" defaultValue={defaultTopic}>
              {TOPICS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Company size" required htmlFor="c-size">
            <Select id="c-size" name="employees" defaultValue="10-49">
              {SIZES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Message" required htmlFor="c-message" hint={errors.message}>
          <Textarea
            id="c-message"
            name="message"
            rows={6}
            placeholder="What are you trying to do, and what are you using today?"
            aria-invalid={Boolean(errors.message)}
          />
        </Field>

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="consent"
            className="mt-0.5 size-4 rounded border-[var(--border-strong)] accent-[var(--primary)]"
          />
          <span className="text-[var(--muted-foreground)]">
            I agree to be contacted about this enquiry. We do not add you to a marketing list.
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
            The message did not send. Please email us directly and we will pick it up.
          </p>
        ) : null}

        <Button type="submit" size="lg" className="w-full" disabled={status === "sending"}>
          <Send aria-hidden />
          {status === "sending" ? "Sending…" : "Send message"}
        </Button>
      </form>
    </Card>
  );
}
