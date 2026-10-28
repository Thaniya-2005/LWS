import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Enrollment = Database["public"]["Tables"]["enrollments"]["Row"];

type AuthState = {
  ready: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  enrollments: Enrollment[];
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const load = useCallback(async (s: Session | null) => {
    if (!s) {
      setProfile(null);
      setEnrollments([]);
      return;
    }
    const [p, e] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", s.user.id).maybeSingle(),
      supabase.from("enrollments").select("*").order("last_accessed_at", { ascending: false }),
    ]);
    setProfile(p.data ?? null);
    setEnrollments(e.data ?? []);
  }, []);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED" || event === "INITIAL_SESSION") {
        // defer DB calls out of the auth callback
        setTimeout(() => void load(s).finally(() => setReady(true)), 0);
      }
    });
    return () => data.subscription.unsubscribe();
  }, [load]);

  const value: AuthState = {
    ready,
    session,
    user: session?.user ?? null,
    profile,
    enrollments,
    refresh: () => load(session),
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}

export function displayName(profile: Profile | null, user: User | null) {
  return profile?.full_name || user?.email?.split("@")[0] || "Learner";
}

export function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("") || "L";
}
