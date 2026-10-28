import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { AuthLayout } from "@/components/lws/AuthLayout";
import { seo } from "@/components/lws/Section";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { displayName, useAuth } from "@/hooks/use-auth";
import { categories } from "@/lib/courses";

export const Route = createFileRoute("/onboarding")({
  head: () => seo("Welcome to LWS — Set up your learning", "Tell us your career interests and goals so LWS can recommend the right courses."),
  component: Onboarding,
});

const goals = ["Get my first job", "Switch careers", "Improve communication", "Build a strong resume", "Earn side income"];
const levels = ["Student", "Fresher", "Working professional", "Career switcher"];

function Chips({ options, value, onChange, multi }: { options: string[]; value: string[]; onChange: (v: string[]) => void; multi: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button type="button" key={o} onClick={() => onChange(multi ? (on ? value.filter((x) => x !== o) : [...value, o]) : [o])}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium ${on ? "border-primary bg-primary-soft text-accent-foreground" : "bg-card text-navy"}`}>
            {on && <Check className="h-4 w-4" />}{o}
          </button>
        );
      })}
    </div>
  );
}

function Onboarding() {
  const { user, profile, ready, refresh } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [g, setG] = useState<string[]>([]);
  const [level, setLevel] = useState<string[]>([]);
  const [err, setErr] = useState("");

  if (!ready) return <AuthLayout title="Loading…" sub=""><span /></AuthLayout>;
  if (!user)
    return (
      <AuthLayout title="Sign in to continue" sub="Your account setup needs you to be signed in.">
        <Link to="/login" className="font-semibold text-primary">Go to sign in</Link>
      </AuthLayout>
    );

  const steps = [
    { t: `Welcome, ${displayName(profile, user)}!`, s: "Let's personalise LWS for you. It takes under a minute.", body: null, ok: true },
    { t: "What are you interested in?", s: "Pick one or more career areas.", body: <Chips multi options={categories.map((c) => c.name)} value={interests} onChange={setInterests} />, ok: interests.length > 0 },
    { t: "What are your learning goals?", s: "Pick all that apply.", body: <Chips multi options={goals} value={g} onChange={setG} />, ok: g.length > 0 },
    { t: "Where are you right now?", s: "Choose the option that fits best.", body: <Chips multi={false} options={levels} value={level} onChange={setLevel} />, ok: level.length > 0 },
  ];
  const cur = steps[step]!;
  const last = step === steps.length - 1;

  const finish = async () => {
    const { error } = await supabase.from("profiles").update({ career_interests: interests, learning_goals: g, experience_level: level[0] ?? null, onboarded: true, updated_at: new Date().toISOString() }).eq("id", user.id);
    if (error) return setErr("Couldn't save your answers. Please try again.");
    await refresh();
    navigate({ to: "/" });
  };

  return (
    <AuthLayout title={cur.t} sub={cur.s}>
      <p className="mb-4 text-xs font-semibold uppercase text-muted-foreground">Step {step + 1} of {steps.length}</p>
      <div className="mb-4 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
      {cur.body}
      {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
      <div className="mt-6 flex gap-3">
        {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}
        <Button className="flex-1" disabled={!cur.ok} onClick={() => (last ? finish() : setStep(step + 1))}>{last ? "Finish setup" : "Continue"}</Button>
      </div>
    </AuthLayout>
  );
}
