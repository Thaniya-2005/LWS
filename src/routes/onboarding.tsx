import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { AvatarPicker } from "@/components/lws/AvatarPicker";
import { choiceLabel, type AvatarChoice } from "@/lib/avatars";

const stepNames = ["Create Account", "Welcome", "Your Interests", "Your Goals", "About You", "Choose Your Profile"];
import { AuthLayout } from "@/components/lws/AuthLayout";
import { seo } from "@/components/lws/Section";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { displayName, useAuth } from "@/hooks/use-auth";
import { categories, getCourse } from "@/lib/courses";

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
          <Button variant="outline" aria-pressed={on} type="button" key={o} onClick={() => onChange(multi ? (on ? value.filter((x) => x !== o) : [...value, o]) : [o])}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium ${on ? "border-primary bg-primary-soft text-accent-foreground" : "bg-card text-navy"}`}>
            {on && <Check className="h-4 w-4" />}{o}
          </Button>
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
  const [busy, setBusy] = useState(false);
  const [avatar, setAvatar] = useState<AvatarChoice>(null);

  if (!ready) return <AuthLayout title="Loading…" sub=""><span /></AuthLayout>;
  if (!user)
    return (
      <AuthLayout title="Sign in to continue" sub="Your account setup needs you to be signed in.">
        <Link to="/login" className="font-semibold text-primary">Go to sign in</Link>
      </AuthLayout>
    );

  const steps = [
    { t: "Which skills do you want to improve?", s: "Pick one or more.", body: (
      <div className="space-y-3">
        <Chips multi options={skillOptions} value={skills} onChange={setSkills} />
        {skills.includes("Other") && (
          <input aria-label="Other skill" placeholder="Tell us the skill" maxLength={100} value={other} onChange={(e) => setOther(e.target.value)}
            className="h-11 w-full rounded-lg border border-border bg-card px-3 text-sm" />
        )}
      </div>
    ), ok: skills.length > 0 && (!skills.includes("Other") || other.trim().length > 0) },
    { t: "What are your learning goals?", s: "Pick all that apply.", body: <Chips multi options={goals} value={g} onChange={setG} />, ok: g.length > 0 },
    { t: "Where are you right now?", s: "Choose the option that fits best.", body: <Chips multi={false} options={levels} value={level} onChange={setLevel} />, ok: level.length > 0 },
    { t: "What are you interested in?", s: "Pick one or more career areas.", body: <Chips multi options={categories.map((c) => c.name)} value={interests} onChange={setInterests} />, ok: interests.length > 0 },
    { t: "Choose Your Avatar", s: "Pick an avatar that feels like you. (Tap to select or unselect)", body: <AvatarPicker name={displayName(profile, user)} value={avatar} onChange={setAvatar} />, ok: true },
  ];
  const cur = steps[step];
  if (!cur) return null;
  const last = step === steps.length - 1;
  const signupStep = step + 2; // step 1 (account) is already complete

  const finish = async (choice: AvatarChoice) => {
    if (busy) return;
    setBusy(true); setErr("");
    const { error } = await supabase.from("profiles").upsert({
      id: user.id, career_interests: interests, learning_goals: g, experience_level: level[0] ?? null,
      avatar_id: choice?.id ?? null, avatar_theme: choice?.id === "initials" ? choice.theme ?? null : null,
      onboarded: true, updated_at: new Date().toISOString(),
    });
    if (error) { setBusy(false); return setErr("Couldn't save your answers. Please try again."); }
    await refresh();
    const intended = sessionStorage.getItem("lws-enroll-course");
    sessionStorage.removeItem("lws-enroll-course");
    if (intended && getCourse(intended)) await navigate({ to: "/courses/$courseId", params: { courseId: intended }, replace: true });
    else await navigate({ to: "/", replace: true });
  };
  const label = choiceLabel(avatar);

  return (
    <AuthLayout title={cur.t} sub={cur.s}>
      {last && (
        <div className="-mt-2 mb-3 flex items-center justify-between text-sm font-semibold">
          <button type="button" onClick={() => setStep(step - 1)} className="inline-flex items-center gap-1 text-foreground"><ArrowLeft className="h-4 w-4" />Back</button>
          <button type="button" disabled={busy} onClick={() => finish(null)} className="text-primary">Skip for now</button>
        </div>
      )}
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-bold uppercase tracking-wide text-primary">Step {signupStep} of 6</span>
        <span className="text-muted-foreground">{stepNames[signupStep - 1]}</span>
      </div>
      <ol className="mb-5 flex items-center" aria-label={`Signup progress: step ${signupStep} of 6`}>
        {stepNames.map((n, i) => {
          const done = i + 1 < signupStep;
          const now = i + 1 === signupStep;
          return (
            <li key={n} className={`flex items-center ${i ? "flex-1" : ""}`} aria-current={now ? "step" : undefined}>
              {i > 0 && <span className={`mx-1 h-1 flex-1 rounded-full ${i + 1 <= signupStep ? "bg-primary" : "bg-muted"}`} />}
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-8 sm:w-8 ${done ? "bg-primary text-primary-foreground" : now ? "border-2 border-primary bg-card text-primary ring-4 ring-primary/15" : "border-2 border-muted bg-card text-muted-foreground"}`}>
                {done ? <Check className="h-4 w-4" /> : i + 1}<span className="sr-only">{n}{done ? " completed" : ""}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <div className={last ? "pb-28 lg:pb-0" : ""}>{cur.body}</div>
      {err && <p className="mt-3 text-sm text-destructive" role="alert">{err}</p>}
      {last ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:static lg:mt-6 lg:border-0 lg:bg-transparent lg:p-0">
          <Button className="h-12 w-full text-base" disabled={busy} onClick={() => finish(avatar)}>{busy ? "Saving…" : "Continue"}</Button>
          <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
            <button type="button" onClick={() => setStep(step - 1)}>← Back</button>
            <span aria-live="polite">{label ? `${label} selected` : "No avatar selected (optional)"}</span>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex gap-3">
          {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}
          <Button className="flex-1" disabled={!cur.ok} onClick={() => setStep(step + 1)}>Continue</Button>
        </div>
      )}
    </AuthLayout>
  );
}
