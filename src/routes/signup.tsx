import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AuthLayout, Field } from "@/components/lws/AuthLayout";
import { SocialAuth } from "@/components/lws/SocialAuth";
import { ConsentDialog, POLICY_VERSION } from "@/components/lws/ConsentDialog";
import { seo } from "@/components/lws/Section";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/signup")({
  head: () => seo("Create account — LWS", "Join LWS and start building your career skills."),
  component: Signup,
});

type Pending = { email: string; password: string; fullName: string };

function Signup() {
  const [err, setErr] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState("");
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  const inFlight = useRef(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const n: Record<string, string> = {};
    if (!f["name"]?.trim()) n["name"] = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(f["email"] ?? "")) n["email"] = "Enter a valid email";
    if ((f["pw"] ?? "").length < 8) n["pw"] = "Use at least 8 characters";
    if (f["pw"] !== f["pw2"]) n["pw2"] = "Passwords don't match";
    setErr(n);
    setMsg("");
    if (Object.keys(n).length) return;
    setPending({ email: f["email"] ?? "", password: f["pw"] ?? "", fullName: f["name"]?.trim() ?? "" });
  };

  const accept = async () => {
    if (!pending || inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: pending.email,
      password: pending.password,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
        data: { full_name: pending.fullName, legal_consent: true, legal_consent_at: new Date().toISOString(), legal_policy_version: POLICY_VERSION },
      },
    });
    setBusy(false);
    inFlight.current = false;
    const email = pending.email;
    setPending(null);
    if (error) return setMsg(error.message);
    setSent(email);
  };

  if (sent)
    return (
      <AuthLayout title="Check your email" sub={`We sent a confirmation link to ${sent}.`}>
        <p className="text-sm text-muted-foreground">Open the link to activate your account, then we'll help you set up your learning goals.</p>
        <Link to="/login" className="mt-6 inline-block font-semibold text-primary">Back to sign in</Link>
      </AuthLayout>
    );
  return (
    <AuthLayout title="Create your account" sub="Your next chapter starts here.">
      <SocialAuth />
      <form onSubmit={submit} className="mt-4 space-y-4" noValidate>
        <Field label="Full name" name="name" autoComplete="name" error={err["name"]} />
        <Field label="Email" name="email" type="email" autoComplete="email" error={err["email"]} />
        <Field label="Password" name="pw" type="password" autoComplete="new-password" error={err["pw"]} />
        <Field label="Confirm password" name="pw2" type="password" autoComplete="new-password" error={err["pw2"]} />
        <p className="text-xs text-muted-foreground">You'll review and accept our Terms & Conditions and Privacy Policy before your account is created.</p>
        <Button type="submit" disabled={busy} className="h-11 w-full">{busy ? "Creating…" : "Create account"}</Button>
        {msg && <p role="alert" className="rounded-lg bg-muted p-3 text-sm text-destructive">{msg}</p>}
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="font-semibold text-primary">Sign in</Link></p>
      <ConsentDialog open={!!pending} busy={busy} onAccept={accept} onBack={() => setPending(null)} onDecline={() => { setPending(null); setMsg("You need to accept both policies to create an account."); }} />
    </AuthLayout>
  );
}
