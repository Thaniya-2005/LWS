import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { parseProfileOverrides, profileStorageKey, type LearnerProfile } from "@/lib/profile-rules";

type ProfileContext = { profile: LearnerProfile; save: (patch: Partial<LearnerProfile>) => void; ready: boolean };
const Context = createContext<ProfileContext | null>(null);

export function FrontendProfileProvider({ children }: { children: ReactNode }) {
  const { user, profile, ready } = useAuth();
  const [local, setLocal] = useState<{ userId: string; values: Partial<LearnerProfile> } | null>(null);
  useEffect(() => {
    if (!user) { setLocal(null); return; }
    const read = () => {
      let raw: string | null = null;
      try { raw = localStorage.getItem(profileStorageKey(user.id)); } catch { /* Saving will report unavailable storage. */ }
      setLocal({ userId: user.id, values: parseProfileOverrides(raw) });
    };
    read();
    const sync = (event: StorageEvent) => { if (event.key === profileStorageKey(user.id) || event.key === null) read(); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [user?.id]);

  const existingLevel = profile?.experience_level ?? "";
  const legacyStages: Record<string, string> = { Student: "College Student", Fresher: "Recent Graduate", "Working professional": "Working Professional", "Career switcher": "Career switcher" };
  const base: LearnerProfile = {
    full_name: profile?.full_name ?? "", phone: profile?.phone ?? "",
    skills_to_improve: profile?.skills_to_improve ?? [], skills_other: profile?.skills_other ?? "",
    learning_goals: profile?.learning_goals ?? [],
    experience_level: legacyStages[existingLevel] ? "" : existingLevel,
    career_stage: legacyStages[existingLevel] ?? "", career_interests: profile?.career_interests ?? [],
    about_me: "", avatar_id: profile?.avatar_id ?? null, avatar_theme: profile?.avatar_theme ?? null,
  };
  const overrides = user && local?.userId === user.id ? local.values : {};
  const value: ProfileContext = {
    profile: { ...base, ...overrides },
    ready: ready && (!user || local?.userId === user.id),
    save: (patch) => {
      if (!user || local?.userId !== user.id) throw new Error("Your profile is still loading. Please try again.");
      const values = { ...local.values, ...parseProfileOverrides(JSON.stringify(patch)) };
      try { localStorage.setItem(profileStorageKey(user.id), JSON.stringify(values)); }
      catch { throw new Error("Couldn't save on this device. Check browser storage and try again."); }
      setLocal({ userId: user.id, values });
    },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useFrontendProfile() {
  const value = useContext(Context);
  if (!value) throw new Error("FrontendProfileProvider is required");
  return value;
}