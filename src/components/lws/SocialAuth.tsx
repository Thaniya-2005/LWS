import { useState } from "react";
import { lovable } from "@/integrations/lovable/index";
import "@lovable.dev/cloud-auth-js/styles.css";
import { Button } from "@/components/ui/button";

export function SocialAuth() {
  const [err, setErr] = useState("");
  const go = async (provider: "google" | "lovable") => {
    setErr("");
    const course = new URLSearchParams(window.location.search).get("course");
    if (course) sessionStorage.setItem("lws-enroll-course", course);
    const r = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (r.error) setErr(r.error.message ?? "Sign-in failed. Please try again.");
  };
  return (
    <div className="space-y-3">
      <Button type="button" variant="outline" className="h-11 w-full" onClick={() => go("google")}>
        Continue with Google
      </Button>
      <button type="button" className="lovable-auth-button w-full" onClick={() => go("lovable")}>
        Continue with Lovable
      </button>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or use email<span className="h-px flex-1 bg-border" /></div>
    </div>
  );
}
