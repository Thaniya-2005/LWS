import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout, Field } from "@/components/lws/AuthLayout";
import { SocialAuth } from "@/components/lws/SocialAuth";
import { seo } from "@/components/lws/Section";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup")({
  head: () => seo("Create account — LWS", "Join LWS and start building your career skills."),
  component: Signup,
});

function Signup() {
  const [err, setErr] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const n: Record<string, string> = {};
    if (!f["name"]?.trim()) n["name"] = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(f["email"] ?? "")) n["email"] = "Enter a valid email";
    if ((f["pw"] ?? "").length < 8) n["pw"] = "Use at least 8 characters";
    if (f["pw"] !== f["pw2"]) n["pw2"] = "Passwords don't match";
    if (!f["terms"]) n["terms"] = "Please accept the terms";
    setErr(n);
    setMsg("");
    if (Object.keys(n).length) return;
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: f["email"]!,
      password: f["pw"]!,
      options: { emailRedirectTo: `${window.location.origin}/onboarding`, data: { full_name: f["name"]!.trim() } },
    });
    setBusy(false);
    if (error) return setMsg(error.message);
    setSent(f["email"]!);
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
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input type="checkbox" name="terms" className="mt-1 accent-primary" /> I agree to the Terms and Privacy Policy
        </label>
        {err["terms"] && <p className="text-xs text-destructive">{err["terms"]}</p>}
        <button disabled={busy} className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Creating…" : "Create account"}</button>
        {msg && <p role="alert" className="rounded-lg bg-muted p-3 text-sm text-destructive">{msg}</p>}
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="font-semibold text-primary">Sign in</Link></p>
    </AuthLayout>
  );
}
