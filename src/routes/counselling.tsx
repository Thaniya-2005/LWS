import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Clock, Compass, FileText, Target, UserRound } from "lucide-react";
import banner from "@/assets/counselling-banner.jpg";
import { Button } from "@/components/ui/button";
import { Page, PageTitle, seo } from "@/components/lws/Section";

export const Route = createFileRoute("/counselling")({
  head: () => seo("Career Counselling with Shikka — LWS", "Book a 1:1 career counselling session with Shikka: 30, 45 or 60 minutes."),
  component: Counselling,
});

const sessions = [
  { mins: 30, price: 1199, desc: "Quick clarity on one focused question.", inc: ["Career clarity", "Resume quick review", "Next-step guidance"] },
  { mins: 45, price: 1699, desc: "Deeper discussion and a personalised plan.", inc: ["Skill gap analysis", "Resume & LinkedIn review", "Personalised action plan"], popular: true },
  { mins: 60, price: 2199, desc: "Complete career strategy session.", inc: ["Long-term career roadmap", "Interview guidance", "Job search strategy"] },
];

const steps = [
  { i: Target, t: "Choose a session", d: "Pick the duration that fits your needs." },
  { i: Clock, t: "Pick a time", d: "Select an available slot that suits you." },
  { i: UserRound, t: "Meet Shikka", d: "Join your 1:1 online session." },
  { i: FileText, t: "Get your plan", d: "Walk away with clear next steps." },
];

function Counselling() {
  const [sel, setSel] = useState(45);
  return (
    <Page>
      <PageTitle image={banner} eyebrow="Career Counselling with Shikka" title="Talk. Plan." accent="Grow." sub="Get personalised 1:1 counselling with Shikka to discuss your career goals, skills, challenges and next steps." />

      <section>
        <h2 className="mb-1 text-lg font-bold md:text-xl">Choose a counselling session</h2>
        <p className="mb-4 text-sm text-muted-foreground">Select the session duration that fits your needs.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {sessions.map((s) => {
            const active = sel === s.mins;
            return (
              <Button variant="outline"
                key={s.mins}
                onClick={() => setSel(s.mins)}
                className={`relative h-auto whitespace-normal items-start flex flex-col rounded-lg border-2 bg-card p-5 text-left transition ${active ? "border-primary shadow-lift" : "border-border"}`}
              >
                {s.popular && <span className="absolute right-4 top-4 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">Most Popular</span>}
                <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"><Clock className="h-4 w-4" /> {s.mins} Minutes</span>
                <span className="mt-2 text-3xl font-extrabold text-navy">₹{s.price.toLocaleString("en-IN")}</span>
                <span className="text-xs text-muted-foreground">per session</span>
                <p className="mt-3 text-sm">{s.desc}</p>
                <ul className="mt-3 space-y-1.5">
                  {s.inc.map((x) => <li key={x} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" />{x}</li>)}
                </ul>
              </Button>
            );
          })}
        </div>
        <div className="mt-5 flex flex-col items-start gap-2 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm"><Compass className="mr-1 inline h-4 w-4 text-primary" /> Selected: <b>{sel}-minute session</b></p>
          <Button disabled className="cursor-not-allowed rounded-lg bg-primary/60 px-5 py-2.5 text-sm font-semibold text-primary-foreground" title="Booking calendar not connected yet">
            Book Session — opening soon
          </Button>
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-lg font-bold md:text-xl">How counselling works</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {steps.map((s, n) => (
            <div key={s.t} className="rounded-lg border bg-card p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft"><s.i className="h-5 w-5 text-primary" /></span>
              <p className="mt-3 text-xs font-semibold text-muted-foreground">Step {n + 1}</p>
              <h3 className="font-bold">{s.t}</h3>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

    </Page>
  );
}
