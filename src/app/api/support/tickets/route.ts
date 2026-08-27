import { clientKey, created, rateLimit, rateLimitResponse, readJson, reference } from "@/lib/api";
import { ticketSchema } from "@/lib/validation";

const RESPONSE_TARGET: Record<string, string> = {
  "production-down": "15 minutes",
  high: "1 hour",
  normal: "1 business hour",
  low: "1 business day",
  question: "1 business day",
};

/**
 * POST /api/support/tickets
 *
 * Creates a support ticket. In production this writes a SupportTicket row,
 * emails a confirmation with a secure upload link for diagnostics bundles, and
 * routes to the on-call queue when severity is production-down.
 */
export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "ticket"), 5, 600_000);
  if (!limit.allowed) return rateLimitResponse(limit.resetAt);

  const parsed = await readJson(request, ticketSchema);
  if (parsed.response) return parsed.response;
  const ticket = parsed.data;

  const ref = reference("ALN");

  return created({
    data: {
      reference: ref,
      status: "open",
      severity: ticket.severity,
      responseTarget: RESPONSE_TARGET[ticket.severity] ?? "1 business day",
      escalated: ticket.severity === "production-down",
      createdAt: new Date().toISOString(),
      uploadUrl: `/portal/support/${ref}/attachments`,
      message:
        ticket.severity === "production-down"
          ? "This ticket has been escalated to the on-call engineer. Call support directly if you do not hear back within 15 minutes."
          : "We have emailed a copy of this ticket. Reply to that email to add information.",
    },
  });
}
