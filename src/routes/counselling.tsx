import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Clock, FileText, Play, Target, UserRound, Video } from "lucide-react";
import banner from "@/assets/counselling-banner.jpg";
import { Button } from "@/components/ui/button";
import { Page, PageTitle, seo } from "@/components/lws/Section";

export const Route = createFileRoute("/counselling")({
  head: () => seo("Career Counselling with Shikka — LWS", "Book a 1:1 career counselling session with Shikka: 30, 45 or 60 minutes."),
  component: Counselling,
});

// Set this to the approved introduction video URL when it is ready.
const INTRO_VIDEO_URL: string | null = null;

const steps = [
  { i: Target, t: "Choose a session", d: "Pick the duration that fits your needs." },
  { i: Clock, t: "Pick a time", d: "Select an available slot that suits you." },
  { i: UserRound, t: "Meet Shikka", d: "Join your 1:1 online session." },
  { i: FileText, t: "Get your plan", d: "Walk away with clear next steps." },
];

function Counselling() {
  const [intro, setIntro] = useState<"pending" | "watched" | "skipped">("pending");
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = () => { setPlaying(true); setTimeout(() => videoRef.current?.play().catch(() => {}), 0); };

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
            <Button variant="outline" onClick={() => navigate({ to: "/counselling/book" })}>Book Your Session</Button>
          )}
        </div>
        {intro !== "pending" && <p className="mt-2 text-xs text-muted-foreground">{intro === "watched" ? "Introduction completed." : "Introduction skipped."}</p>}
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
