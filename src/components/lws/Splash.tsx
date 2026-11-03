import { useEffect, useState } from "react";
import { Briefcase, Compass, GraduationCap, HeartHandshake } from "lucide-react";
import logo from "@/assets/lws-logo.png.asset.json";
import { Button } from "@/components/ui/button";

const cards = [
  { icon: Compass, h: "Build Your Career", d: "Discover your strengths, explore career opportunities and take the first step towards building a successful professional future." },
  { icon: Briefcase, h: "Become Job-Ready", d: "Develop essential professional skills, improve your resume and prepare confidently for interviews and placement opportunities." },
  { icon: GraduationCap, h: "Learn at Your Pace", d: "Access structured courses and practical learning resources designed to help you improve your skills at your own pace." },
  { icon: HeartHandshake, h: "Get Career Guidance", d: "Get guidance to understand your career direction, improve your confidence and take the right next steps." },
];
const INTRO_KEY = "has_seen_intro";

export function Splash() {
  const [stage, setStage] = useState<"none" | "logo" | "intro">("none");
  const [i, setI] = useState(0);
  useEffect(() => {
    if (sessionStorage.getItem("lws-splash")) return;
    sessionStorage.setItem("lws-splash", "1");
    setStage("logo");
    const t = setTimeout(() => setStage(localStorage.getItem(INTRO_KEY) ? "none" : "intro"), 1400);
    return () => clearTimeout(t);
  }, []);
  const finish = () => { localStorage.setItem(INTRO_KEY, "1"); setStage("none"); };
  if (stage === "none") return null;
  if (stage === "logo")
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background" aria-hidden>
        <img src={logo.url} alt="" className="animate-logo-in h-40 w-auto" />
        <p className="mt-4 animate-fade-up text-sm text-muted-foreground [animation-delay:400ms]">Your next chapter starts here.</p>
      </div>
    );
  const c = cards[i]!;
  const Icon = c.icon;
  return (
    <div role="dialog" aria-modal="true" aria-label="Welcome to LWS" className="fixed inset-0 z-[100] flex flex-col bg-background px-5 py-6">
      <div className="flex items-center justify-between">
        <img src={logo.url} alt="LWS" className="h-10 w-auto" />
        {i < cards.length - 1 && <Button variant="ghost" onClick={finish}>Skip</Button>}
      </div>
      <div key={i} className="mx-auto flex w-full max-w-md flex-1 animate-fade-up flex-col items-center justify-center text-center">
        <div className="flex h-40 w-40 items-center justify-center rounded-full bg-primary-soft">
          <Icon className="h-20 w-20 text-primary" strokeWidth={1.5} />
        </div>
        <h2 className="mt-8 text-3xl font-extrabold">{c.h}</h2>
        <p className="mt-3 text-muted-foreground">{c.d}</p>
      </div>
      <div className="mx-auto w-full max-w-md">
        <div className="mb-5 flex justify-center gap-2" aria-label={`Card ${i + 1} of ${cards.length}`}>
          {cards.map((_, n) => <span key={n} className={`h-2 rounded-full transition-all ${n === i ? "w-6 bg-primary" : "w-2 bg-muted"}`} />)}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" disabled={i === 0} onClick={() => setI(i - 1)} className={i === 0 ? "invisible" : ""}>Back</Button>
          {i < cards.length - 1 ? <Button onClick={() => setI(i + 1)}>Next</Button> : <Button onClick={finish}>Get Started</Button>}
        </div>
      </div>
    </div>
  );
}
