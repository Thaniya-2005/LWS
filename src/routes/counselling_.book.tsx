import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page, seo } from "@/components/lws/Section";
import { useAuth } from "@/hooks/use-auth";
import { counsellingSessions } from "@/lib/counselling";

export const Route = createFileRoute("/counselling_/book")({
  validateSearch: (s: Record<string, unknown>): { plan?: number } => {
    const p = Number(s["plan"]);
    return [30, 45, 60].includes(p) ? { plan: p } : {};
  },
  head: () => seo("Choose Your Counselling Plan — LWS", "Pick a 30, 45 or 60 minute 1:1 career counselling session with Shikka."),
  component: Book,
});

function Book() {
  const { plan } = Route.useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const chosen = counsellingSessions.find((s) => s.mins === plan);

  return (
    <Page>
      <div>
        <Link to="/counselling" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="h-4 w-4" /> Back to Introduction</Link>
        <h1 className="mt-3 font-display text-2xl font-bold md:text-3xl">Choose Your Counselling Plan</h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">One-to-one online sessions with Shikka. Pick the duration that fits what you want to work on.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {counsellingSessions.map((s) => (
          <div key={s.mins} className={`relative flex flex-col rounded-lg border-2 bg-card p-5 ${plan === s.mins ? "border-primary shadow-lift" : "border-border"}`}>
            {s.popular && <span className="absolute right-4 top-4 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">Most Popular</span>}
            <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"><Clock className="h-4 w-4" /> {s.mins}-Minute Session</span>
            <span className="mt-2 text-3xl font-extrabold">₹{s.price.toLocaleString("en-IN")}</span>
            <span className="text-xs text-muted-foreground">per session</span>
            <p className="mt-3 text-sm">{s.desc}</p>
            <ul className="mt-3 flex-1 space-y-1.5">
              {s.inc.map((x) => <li key={x} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-success" />{x}</li>)}
            </ul>
            <Button className="mt-4 w-full" onClick={() => navigate({ to: "/counselling/book", search: { plan: s.mins }, replace: true })}>Book This Session</Button>
          </div>
        ))}
      </div>
      {chosen && (
        <div role="status" className="rounded-lg border bg-card p-4 text-sm">
          <p><b>Selected:</b> {chosen.mins}-minute session — ₹{chosen.price.toLocaleString("en-IN")}</p>
          {user ? (
            <p className="mt-2 flex items-start gap-2 text-muted-foreground"><Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Online payment and the booking calendar aren't connected yet, so sessions can't be booked here today. No booking or payment has been made.</p>
          ) : (
            <p className="mt-2 text-muted-foreground">Please <Link to="/login" onClick={() => sessionStorage.setItem("lws-counselling-plan", String(chosen.mins))} className="font-semibold text-primary underline">sign in</Link> to continue. We'll bring you back to this plan.</p>
          )}
        </div>
      )}
    </Page>
  );
}
