import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout, Field } from "@/components/lws/AuthLayout";
import { seo } from "@/components/lws/Section";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => seo("Set a new password — LWS", "Choose a new password for your LWS account."),
  component: Reset,
});

function Reset() {
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  return (
    <AuthLayout title="Set a new password" sub="Choose a password with at least 8 characters.">
      <form
        noValidate
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const pw = String(f.get("pw"));
          if (pw.length < 8) return setErr("Use at least 8 characters");
          if (pw !== String(f.get("pw2"))) return setErr("Passwords don't match");
          setErr("");
          const { error } = await supabase.auth.updateUser({ password: pw });
          if (error) return setMsg("This reset link has expired. Please request a new one.");
          navigate({ to: "/" });
        }}
      >
        <Field label="New password" name="pw" type="password" autoComplete="new-password" error={err} />
        <Field label="Confirm password" name="pw2" type="password" autoComplete="new-password" />
        <button className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground">Update password</button>
        {msg && <p className="rounded-lg bg-muted p-3 text-sm text-destructive">{msg} <Link to="/forgot-password" className="font-semibold text-primary">Request link</Link></p>}
      </form>
    </AuthLayout>
  );
}
