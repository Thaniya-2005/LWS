import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { CheckCircle2, Clock, FileText, Info, Play, Target, UserRound, Video } from "lucide-react";
import banner from "@/assets/counselling-banner.jpg";
import { Button } from "@/components/ui/button";
import { Page, PageTitle, seo } from "@/components/lws/Section";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/counselling")({
  head: () => seo("Career Counselling with Shikka — LWS", "Book a 1:1 career counselling session with Shikka: 30, 45 or 60 minutes."),
  component: Counselling,
});

// Set this to the approved introduction video URL when it is ready.
const INTRO_VIDEO_URL: string | null = null;

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
  const { user } = useAuth();
  const [intro, setIntro] = useState<"pending" | "watched" | "skipped">("pending");
  const [showPlans, setShowPlans] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const plansRef = useRef<HTMLElement>(null);

  const play = () => { setPlaying(true); setTimeout(() => videoRef.current?.play().catch(() => {}), 0); };
  const chosen = sessions.find((s) => s.mins === sel);

  return (
    <Page>
      <PageTitle image={banner} eyebrow="1-to-1 Career Counselling with Shikka" title="Get Personal" accent="Career Guidance" sub="Get one-to-one guidance to understand your career direction, improve your skills, and take your next step with confidence." />

      <section className="rounded-lg border bg-card p-4 md:p-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          {INTRO_VIDEO_URL && playing ? (
            <video ref={videoRef} src={INTRO_VIDEO_URL} controls playsInline className="h-full w-full" onEnded={() => setIntro("watched")} />
          ) : (
            <>
              <img src={banner} alt="" className="h-full w-full object-cover opacity-60" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
                {INTRO_VIDEO_URL ? (
                  <button type="button" onClick={play} aria-label="Play introduction video" className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift transition hover:scale-105">
                    <Play className="ml-1 h-7 w-7" />
                  </button>
                ) : (
                  <div className="rounded-lg bg-card/90 px-4 py-3 shadow-lift">
                    <Video className="mx-auto h-7 w-7 text-primary" />
                    <p className="mt-1 text-sm font-semibold">Introduction video coming soon</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button onClick={play} disabled={!INTRO_VIDEO_URL} className="sm:w-auto"><Play className="h-4 w-4" /> Watch Introduction</Button>
          {intro === "pending" ? (
            <Button variant="outline" onClick={() => setIntro("skipped")}>Skip & Continue</Button>
          ) : (
            <Button variant="outline" onClick={() => { setShowPlans(true); setTimeout(() => plansRef.current?.scrollIntoView?.({ behavior: "smooth" }), 50); }}>Book Your Session</Button>
          )}
        </div>
        {intro !== "pending" && <p className="mt-2 text-xs text-muted-foreground">{intro === "watched" ? "Introduction completed." : "Introduction skipped."}</p>}
      </section>

      {showPlans && (
        <section ref={plansRef} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h2 className="mb-1 text-lg font-bold md:text-xl">Choose a counselling session</h2>
          <p className="mb-4 text-sm text-muted-foreground">Select the session duration that fits your needs.</p>
          <div className="grid gap-4 md:grid-cols-3">
            {sessions.map((s) => (
              <div key={s.mins} className={`relative flex flex-col rounded-lg border-2 bg-card p-5 ${sel === s.mins ? "border-primary shadow-lift" : "border-border"}`}>
                {s.popular && <span className="absolute right-4 top-4 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">Most Popular</span>}
                <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"><Clock className="h-4 w-4" /> {s.mins}-Minute Session</span>
                <span className="mt-2 text-3xl font-extrabold">₹{s.price.toLocaleString("en-IN")}</span>
                <span className="text-xs text-muted-foreground">per session</span>
                <p className="mt-3 text-sm">{s.desc}</p>
                <ul className="mt-3 flex-1 space-y-1.5">
                  {s.inc.map((x) => <li key={x} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-success" />{x}</li>)}
                </ul>
                <Button className="mt-4 w-full" onClick={() => setSel(s.mins)}>Book This Session</Button>
              </div>
            ))}
          </div>
          {chosen && (
            <div role="status" className="mt-5 rounded-lg border bg-card p-4 text-sm">
              <p><b>Selected:</b> {chosen.mins}-minute session — ₹{chosen.price.toLocaleString("en-IN")}</p>
              {user ? (
                <p className="mt-2 flex items-start gap-2 text-muted-foreground"><Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Online payment and the booking calendar aren't connected yet, so sessions can't be booked here today. No booking or payment has been made.</p>
              ) : (
                <p className="mt-2 text-muted-foreground">Please <Link to="/login" className="font-semibold text-primary underline">sign in</Link> to continue. Your selection stays on this page.</p>
              )}
            </div>
          )}
        </section>
      )}

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
