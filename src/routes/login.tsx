import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout, Field } from "@/components/lws/AuthLayout";
import { SocialAuth } from "@/components/lws/SocialAuth";
import { seo } from "@/components/lws/Section";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { getCourse } from "@/lib/courses";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { course?: string } => typeof search["course"] === "string" && getCourse(search["course"]) ? { course: search["course"] } : {},
  head: () => seo("Sign in — LWS", "Sign in to continue your LWS career learning journey."),
  component: Login,
});

function Login() {
  const { course } = Route.useSearch();
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, profile, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready || !user) return;
    if (course) sessionStorage.setItem("lws-enroll-course", course);
    if (profile && !profile.onboarded) { void navigate({ to: "/onboarding", replace: true }); return; }
    const intended = course || sessionStorage.getItem("lws-enroll-course");
    sessionStorage.removeItem("lws-enroll-course");
    const plan = Number(sessionStorage.getItem("lws-counselling-plan"));
    sessionStorage.removeItem("lws-counselling-plan");
    if (!intended && [30, 45, 60].includes(plan)) { void navigate({ to: "/counselling/book", search: { plan }, replace: true }); return; }
    if (intended && getCourse(intended)) void navigate({ to: "/courses/$courseId", params: { courseId: intended }, replace: true });
    else void navigate({ to: "/", replace: true });
  }, [ready, user, profile, navigate, course]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("id")).trim();
    const password = String(f.get("pw"));
    const n: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) n["id"] = "Enter a valid email";
    if (password.length < 6) n["pw"] = "Password must be at least 6 characters";
    setErr(n);
    setMsg("");
    if (Object.keys(n).length) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setMsg(error.message.includes("confirm") ? "Please confirm your email first — check your inbox." : "Incorrect email or password.");
  };
  return (
    <AuthLayout title="Welcome Back" sub="Sign in to continue your career journey.">
      <SocialAuth />
      <form onSubmit={submit} className="mt-4 space-y-4" noValidate>
        <Field label="Email" name="id" type="email" autoComplete="email" error={err["id"]} />
        <div className="relative">
          <Field label="Password" name="pw" type={show ? "text" : "password"} autoComplete="current-password" error={err["pw"]} />
          <Button variant="ghost" size="icon" type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-7 text-muted-foreground" aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <div className="text-right"><Link to="/forgot-password" className="text-sm font-semibold text-primary">Forgot password?</Link></div>
        <Button disabled={busy} className="h-11 w-full">{busy ? "Signing in…" : "Sign in"}</Button>
        {msg && <p role="alert" className="rounded-lg bg-muted p-3 text-sm text-destructive">{msg}</p>}
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">New to LWS? <Link to="/signup" className="font-semibold text-primary">Create an account</Link></p>
      <p className="mt-2 text-center"><Link to="/" className="text-sm text-muted-foreground underline">Continue browsing</Link></p>
    </AuthLayout>
  );
}
