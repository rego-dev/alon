import { z } from "zod";

export const ticketSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.email("Enter a valid email address"),
  organisation: z.string().min(2, "Please enter your organisation"),
  product: z.string().min(1, "Choose the product this relates to"),
  version: z.string().optional(),
  severity: z.enum(["question", "low", "normal", "high", "production-down"]),
  subject: z.string().min(6, "Give the ticket a short subject").max(120, "Keep the subject under 120 characters"),
  message: z.string().min(20, "Please describe what happened in at least 20 characters"),
  consent: z.literal(true, { error: "Please confirm before submitting" }),
});

export type TicketInput = z.infer<typeof ticketSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.email("Enter a valid email address"),
  company: z.string().min(2, "Please enter your company"),
  phone: z.string().optional(),
  topic: z.enum(["sales", "support", "billing", "partnership", "other"]),
  employees: z.enum(["1-9", "10-49", "50-199", "200-999", "1000+"]),
  message: z.string().min(10, "Tell us a little more").max(2000, "Please keep it under 2000 characters"),
  consent: z.literal(true, { error: "Please confirm before submitting" }),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const trialActivationSchema = z.object({
  productSlug: z.string().min(1),
  organisationId: z.string().min(1),
  device: z.object({
    machineId: z.string().min(4),
    diskSerial: z.string().optional(),
    macAddress: z.string().optional(),
    cpuSignature: z.string().optional(),
    osName: z.string().min(2),
    osVersion: z.string().min(1),
    hostname: z.string().optional(),
  }),
  clientClock: z.iso.datetime(),
  emailDomain: z.string().min(3),
  emailVerified: z.boolean().default(false),
  isVirtualMachine: z.boolean().default(false),
});

export type TrialActivationInput = z.infer<typeof trialActivationSchema>;

/** Flattens a ZodError into { field: message } for form rendering. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
