import { KeyRound, Lock, ShieldCheck, Users } from "lucide-react";
import { demoOrganisation } from "@/data/demo-account";
import { DEFAULT_POLICY } from "@/lib/licensing/policy";
import { Badge, Card, Field, Input, Select } from "@/components/ui/primitives";
import { Button, ButtonLink } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/app-shell";

const TEAM = [
  { name: "Maria Santos", email: "maria.santos@northgate.example", role: "Owner", mfa: true },
  { name: "Joel Reyes", email: "joel.reyes@northgate.example", role: "Admin", mfa: true },
  { name: "Ana Villareal", email: "ana.villareal@northgate.example", role: "Billing", mfa: false },
  { name: "Ken Dizon", email: "ken.dizon@northgate.example", role: "Member", mfa: true },
];

export default function PortalSettingsPage() {
  return (
    <>
      <PageTitle title="Settings" description="Organisation profile, team access, security and data preferences." />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Organisation */}
        <Card className="p-6">
          <h2 className="font-semibold">Organisation</h2>
          <form className="mt-5 space-y-4">
            <Field label="Organisation name" htmlFor="s-name">
              <Input id="s-name" defaultValue={demoOrganisation.name} />
            </Field>
            <Field label="Billing email" htmlFor="s-email">
              <Input id="s-email" type="email" defaultValue={demoOrganisation.billingEmail} />
            </Field>
            <Field label="Address" htmlFor="s-address">
              <Input id="s-address" defaultValue={demoOrganisation.address} />
            </Field>
            <Field label="Country" htmlFor="s-country">
              <Select id="s-country" defaultValue={demoOrganisation.country}>
                <option>Philippines</option>
                <option>United States</option>
                <option>Singapore</option>
                <option>Spain</option>
              </Select>
            </Field>
            <Button type="button" size="sm">
              Save changes
            </Button>
          </form>
        </Card>

        {/* Security */}
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="size-4 text-[var(--viz-good)]" aria-hidden />
              Security
            </h2>
            <ul className="mt-5 space-y-4">
              {[
                { label: "Multi-factor authentication", detail: "Required for all users", enabled: true, Icon: Lock },
                { label: "Hardware security keys", detail: "WebAuthn, 2 keys registered", enabled: true, Icon: KeyRound },
                { label: "Single sign-on (SAML/OIDC)", detail: "Available on Enterprise", enabled: false, Icon: Users },
              ].map(({ label, detail, enabled, Icon }) => (
                <li key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{detail}</p>
                  </div>
                  <Badge tone={enabled ? "success" : "neutral"}>{enabled ? "On" : "Not available"}</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold">Data & retention</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
              Your plan uses the platform default policy. Enterprise organisations can set these values themselves.
            </p>
            <dl className="mt-4 space-y-2.5 text-sm">
              {[
                ["Grace period", `${DEFAULT_POLICY.graceDays} days, read-only`],
                ["Data retention after grace", `${DEFAULT_POLICY.dataRetentionDays} days`],
                ["Automatic deletion", DEFAULT_POLICY.autoDeleteEnabled ? "Enabled" : "Disabled"],
                ["Cloud backup", "Nightly, 90-day history"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-[var(--muted-foreground)]">{label}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="secondary" size="sm">
                Export all data
              </Button>
              <ButtonLink href="/legal/data-retention" variant="ghost" size="sm">
                Read the policy
              </ButtonLink>
            </div>
          </Card>
        </div>
      </div>

      {/* Team */}
      <Card className="mt-8 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Team</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {demoOrganisation.seatsUsed} of {demoOrganisation.seats} seats in use
            </p>
          </div>
          <Button size="sm">Invite a colleague</Button>
        </div>

        <ul className="mt-5 divide-y divide-[var(--border)]">
          {TEAM.map((member) => (
            <li key={member.email} className="flex flex-wrap items-center gap-3 py-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-xs font-semibold text-white">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{member.name}</p>
                <p className="truncate text-xs text-[var(--muted-foreground)]">{member.email}</p>
              </div>
              <Badge tone={member.mfa ? "success" : "warning"}>{member.mfa ? "MFA on" : "MFA off"}</Badge>
              <Badge tone="neutral">{member.role}</Badge>
              <Button variant="ghost" size="sm">
                Manage
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
