import { clientKey, created, rateLimit, rateLimitResponse, readJson } from "@/lib/api";
import { contactSchema } from "@/lib/validation";

const ROUTING: Record<string, { team: string; sla: string }> = {
  sales: { team: "Sales", sla: "Usually within minutes during business hours" },
  support: { team: "Technical support", sla: "1 business hour on paid plans" },
  billing: { team: "Billing", sla: "1 business day" },
  partnership: { team: "Partnerships", sla: "2 business days" },
  other: { team: "General enquiries", sla: "1 business day" },
};

/** POST /api/contact — routes an enquiry to the right team. */
export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "contact"), 5, 600_000);
  if (!limit.allowed) return rateLimitResponse(limit.resetAt);

  const parsed = await readJson(request, contactSchema);
  if (parsed.response) return parsed.response;
  const enquiry = parsed.data;

  const routing = ROUTING[enquiry.topic] ?? ROUTING.other;

  return created({
    data: {
      received: true,
      routedTo: routing.team,
      responseTarget: routing.sla,
      receivedAt: new Date().toISOString(),
      // Larger organisations get a named contact rather than the shared queue.
      assignedOwner: ["200-999", "1000+"].includes(enquiry.employees) ? "Named account executive" : "Shared queue",
    },
  });
}
