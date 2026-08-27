import { getPrisma } from "@/lib/prisma";
import type { ContactInput, TicketInput } from "@/lib/validation";
import { pick } from "./backend";

export type TicketSeverity = TicketInput["severity"];

export interface TicketRecord {
  reference: string;
  severity: TicketSeverity;
  status: "open";
  createdAt: Date;
}

export interface ContactRecord {
  id: string;
  topic: ContactInput["topic"];
  createdAt: Date;
}

const SEVERITY_TO_DB: Record<TicketSeverity, string> = {
  question: "QUESTION",
  low: "LOW",
  normal: "NORMAL",
  high: "HIGH",
  "production-down": "PRODUCTION_DOWN",
};

/**
 * Persists a support ticket.
 *
 * The demo backend has nowhere to write, so it returns the record the caller
 * would have got without storing it — the endpoint's response is identical
 * either way, which is the point of the seam.
 */
export async function createTicket(input: TicketInput, reference: string): Promise<TicketRecord> {
  const createdAt = new Date();
  return pick(
    async (): Promise<TicketRecord> => ({
      reference,
      severity: input.severity,
      status: "open",
      createdAt,
    }),
    async (): Promise<TicketRecord> => {
      await getPrisma().supportTicket.create({
        data: {
          reference,
          productSlug: input.product,
          version: input.version ?? null,
          severity: SEVERITY_TO_DB[input.severity] as never,
          subject: input.subject,
          body: input.message,
          contactName: input.name,
          contactEmail: input.email,
        },
      });
      return { reference, severity: input.severity, status: "open", createdAt };
    },
  )();
}

/** Persists a contact enquiry from the marketing site. */
export async function createContactRequest(input: ContactInput): Promise<ContactRecord> {
  const createdAt = new Date();
  return pick(
    async (): Promise<ContactRecord> => ({
      id: `req_demo_${createdAt.getTime().toString(36)}`,
      topic: input.topic,
      createdAt,
    }),
    async (): Promise<ContactRecord> => {
      const row = await getPrisma().contactRequest.create({
        data: {
          name: input.name,
          email: input.email,
          company: input.company,
          phone: input.phone ?? null,
          topic: input.topic,
          employees: input.employees,
          message: input.message,
        },
        select: { id: true, createdAt: true },
      });
      return { id: row.id, topic: input.topic, createdAt: row.createdAt };
    },
  )();
}
