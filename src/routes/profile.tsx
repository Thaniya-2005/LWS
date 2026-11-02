import { UserAvatar } from "@/components/lws/UserAvatar";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, LogIn, Pencil, UserRound } from "lucide-react";
import banner from "@/assets/profile-banner.jpg";
import { Page, seo } from "@/components/lws/Section";
import { accountLinks } from "@/components/lws/AppShell";
import { AppearanceSelector } from "@/components/lws/AppearanceSelector";
import { AvatarPicker } from "@/components/lws/AvatarPicker";
import { useAuth } from "@/hooks/use-auth";
import { useFrontendProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { categories } from "@/lib/courses";
import { choiceLabel } from "@/lib/avatars";
import {
  experienceOptions, goalOptions, profileCompletion, profileRequirements, skillOptions, stageOptions, validateProfileSection,
  type LearnerProfile, type ProfileSection,
} from "@/lib/profile-rules";

export const Route = createFileRoute("/profile")({
  head: () => seo("My Profile — LWS", "Manage your LWS learner profile, goals, avatar and appearance."),
  component: Profile,
});

const interestOptions = categories.map((c) => c.name as string);
const titles: Record<ProfileSection, string> = {
  personal: "Personal information", skills: "Skills to improve", goals: "Learning goals", experience: "Experience level",
  stage: "Career stage", interests: "Career interests", avatar: "Avatar",
};

function Ring({ value }: { value: number }) {
  const r = 34, c = 2 * Math.PI * r;
  return <div className="relative h-24 w-24 shrink-0" role="img" aria-label={`Profile ${value}% complete`}>
    <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90"><circle cx="40" cy="40" r={r} fill="none" strokeWidth="7" className="stroke-muted" /><circle cx="40" cy="40" r={r} fill="none" strokeWidth="7" strokeLinecap="round" className="stroke-primary transition-all" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} /></svg>
    <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">{value}%</span>
  </div>;
}

function Chips({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  return <div className="flex flex-wrap gap-2">{options.map((o) => { const on = value.includes(o); return <button type="button" key={o} aria-pressed={on} onClick={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])} className={`rounded-full border px-3 py-1.5 text-sm ${on ? "border-primary bg-primary-soft font-semibold" : "bg-card"}`}>{o}</button>; })}</div>;
}
function Single({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return <div role="radiogroup" className="grid gap-2 sm:grid-cols-2">{options.map((o) => <button type="button" role="radio" aria-checked={value === o} key={o} onClick={() => onChange(o)} className={`rounded-lg border px-3 py-2.5 text-left text-sm ${value === o ? "border-primary bg-primary-soft font-semibold" : "bg-card"}`}>{o}</button>)}</div>;
}

function Profile() {
  const { ready, user, enrollments } = useAuth();
  const { profile, save, ready: profileReady } = useFrontendProfile();
  const [editing, setEditing] = useState<ProfileSection | null>(null);
  const [draft, setDraft] = useState<LearnerProfile>(profile);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [confirmClose, setConfirmClose] = useState(false);
  if (!ready || (user && !profileReady)) return <Page><p role="status">Loading your profile…</p></Page>;
  const email = user?.email ?? "";
  const shown = editing ? draft : profile;
  const completion = profileCompletion(shown, email);
  const missing = profileRequirements(shown, email).filter((r) => !r.complete);
  const dirty = editing !== null && JSON.stringify(draft) !== JSON.stringify(profile);
  const open = (s: ProfileSection) => { setDraft(profile); setErrors({}); setNotice(""); setEditing(s); };
  const close = () => { setEditing(null); setConfirmClose(false); setErrors({}); };
  const requestClose = () => (dirty ? setConfirmClose(true) : close());
  const set = (patch: Partial<LearnerProfile>) => setDraft((d) => ({ ...d, ...patch }));
  const submit = () => {
    if (!editing) return;
    const e = validateProfileSection(draft, editing); setErrors(e);
    if (Object.keys(e).length) return;
    try { save(draft); setNotice("Profile saved on this device."); close(); }
    catch (err) { setErrors({ form: err instanceof Error ? err.message : "Couldn't save. Please try again." }); }
  };
  const name = profile.full_name || "Learner";
  const Row = ({ s, value }: { s: ProfileSection; value: string }) => {
    const req = s !== "avatar" && missing.some((m) => m.section === s && m.field !== "email");
    return <div className="flex items-start gap-3 px-4 py-3.5">
      <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{titles[s]}</p><p className={`text-sm ${req ? "text-destructive" : "text-muted-foreground"} break-words`}>{value || (req ? "Required — not added yet" : "Optional — not added")}</p></div>
      <Button variant="ghost" size="sm" onClick={() => open(s)} aria-label={`Edit ${titles[s]}`}><Pencil className="h-4 w-4" /> Edit</Button>
    </div>;
  };

  return (
    <Page>
      <section className="reference-banner">
        <img src={banner} alt="" className="banner-art" />
        <div className="banner-copy flex flex-col items-start gap-4">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-card shadow-card">{user ? <UserAvatar name={name} avatarId={profile.avatar_id} theme={profile.avatar_theme} size={80} /> : <UserRound className="h-10 w-10 text-primary" />}</span>
          <div className="min-w-0"><h1 className="text-2xl font-extrabold break-words">{user ? name : "Welcome to LWS"}</h1><p className="text-sm text-muted-foreground break-all">{user ? email : "Sign in to see your profile, learning stats and saved courses."}</p></div>
          {!user && <Button asChild><Link to="/login"><LogIn className="h-4 w-4" /> Sign in</Link></Button>}
        </div>
      </section>
      {notice && <p role="status" className="text-sm text-success">{notice}</p>}
      {user && <>
        <section className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center">
          <Ring value={completion} />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold">{completion === 100 ? "Your profile is complete" : "Complete your profile"}</h2>
            <p className="text-sm text-muted-foreground">{missing.length ? `Missing: ${missing.map((m) => m.label).join(", ")}` : "All required details are added. Avatar and About Me are optional."}</p>
          </div>
          {missing.length > 0 && (missing[0]!.field === "email"
            ? <Button asChild variant="outline"><Link to="/login">Sign in again</Link></Button>
            : <Button onClick={() => open(missing[0]!.section)}>Complete My Profile</Button>)}
        </section>
        <section className="grid grid-cols-2 gap-4 rounded-lg border bg-card p-4">
          {enrollments.length ? <>
            <div><p className="text-3xl font-bold text-primary">{enrollments.length}</p><p className="text-sm text-muted-foreground">Enrolled courses</p></div>
            <div><p className="text-3xl font-bold text-success">{enrollments.filter((e) => e.progress === 100).length}</p><p className="text-sm text-muted-foreground">Completed courses</p></div>
          </> : <p className="col-span-2 text-sm text-muted-foreground">No learning activity yet. <Link to="/courses" className="font-semibold text-primary">Explore courses</Link></p>}
        </section>
        <section><h2 className="mb-3 text-xl font-bold">Profile details</h2>
          <div className="divide-y rounded-lg border bg-card">
            <Row s="personal" value={[profile.full_name, profile.phone].filter(Boolean).join(" · ")} />
            <div className="px-4 py-3.5"><p className="text-sm font-semibold">Account email</p><p className="text-sm text-muted-foreground break-all">{email || "Not available — sign in again"} (can't be changed here)</p></div>
            <Row s="skills" value={profile.skills_to_improve.map((x) => x === "Other" && profile.skills_other ? `Other: ${profile.skills_other}` : x).join(" · ")} />
            <Row s="goals" value={profile.learning_goals.join(" · ")} />
            <Row s="experience" value={profile.experience_level} />
            <Row s="stage" value={profile.career_stage} />
            <Row s="interests" value={profile.career_interests.join(" · ")} />
            <Row s="avatar" value={profile.avatar_id ? choiceLabel({ id: profile.avatar_id, ...(profile.avatar_theme ? { theme: profile.avatar_theme } : {}) }) : ""} />
          </div>
          {profile.about_me && <p className="mt-3 text-sm"><span className="font-semibold">About me:</span> {profile.about_me}</p>}
        </section>
      </>}
      <section><h2 className="mb-3 text-xl font-bold">Appearance</h2><AppearanceSelector /></section>
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Account & community</h2>
        <div className="divide-y rounded-lg border bg-card">
          {accountLinks.filter((l) => l.to !== "/profile").map((l) => (
            <Link key={l.to} to={l.to} className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-navy">
              <l.icon className="h-5 w-5 text-primary" /> <span className="flex-1">{l.label}</span>
              {l.soon && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">Soon</span>}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      <Dialog open={editing !== null} onOpenChange={(o) => { if (!o) requestClose(); }}>
        <DialogContent className="max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-lg overflow-y-auto">
          {editing && <>
            <DialogHeader><DialogTitle>{titles[editing]}</DialogTitle><DialogDescription>Profile completion preview: {completion}%</DialogDescription></DialogHeader>
            <div className="space-y-3">
              {editing === "personal" && <>
                <label className="block text-sm font-medium">Full name<input value={draft.full_name} onChange={(e) => set({ full_name: e.target.value })} autoComplete="name" className="mt-2 w-full rounded-lg border bg-card px-3 py-2" aria-invalid={!!errors["full_name"]} /></label>
                {errors["full_name"] && <p className="text-sm text-destructive">{errors["full_name"]}</p>}
                <label className="block text-sm font-medium">Phone (optional)<input value={draft.phone} onChange={(e) => set({ phone: e.target.value })} type="tel" autoComplete="tel" className="mt-2 w-full rounded-lg border bg-card px-3 py-2" /></label>
                <label className="block text-sm font-medium">About me (optional)<textarea value={draft.about_me} maxLength={500} onChange={(e) => set({ about_me: e.target.value })} rows={3} className="mt-2 w-full rounded-lg border bg-card px-3 py-2" /></label>
              </>}
              {editing === "skills" && <>
                <Chips options={skillOptions} value={draft.skills_to_improve} onChange={(v) => set({ skills_to_improve: v })} />
                {errors["skills_to_improve"] && <p className="text-sm text-destructive">{errors["skills_to_improve"]}</p>}
                {draft.skills_to_improve.includes("Other") && <label className="block text-sm font-medium">Other skill<input value={draft.skills_other} onChange={(e) => set({ skills_other: e.target.value })} className="mt-2 w-full rounded-lg border bg-card px-3 py-2" /></label>}
                {errors["skills_other"] && <p className="text-sm text-destructive">{errors["skills_other"]}</p>}
              </>}
              {editing === "goals" && <><Chips options={goalOptions} value={draft.learning_goals} onChange={(v) => set({ learning_goals: v })} />{errors["learning_goals"] && <p className="text-sm text-destructive">{errors["learning_goals"]}</p>}</>}
              {editing === "experience" && <><Single options={experienceOptions} value={draft.experience_level} onChange={(v) => set({ experience_level: v })} />{errors["experience_level"] && <p className="text-sm text-destructive">{errors["experience_level"]}</p>}</>}
              {editing === "stage" && <><Single options={stageOptions} value={draft.career_stage} onChange={(v) => set({ career_stage: v })} />{errors["career_stage"] && <p className="text-sm text-destructive">{errors["career_stage"]}</p>}</>}
              {editing === "interests" && <><Chips options={interestOptions} value={draft.career_interests} onChange={(v) => set({ career_interests: v })} />{errors["career_interests"] && <p className="text-sm text-destructive">{errors["career_interests"]}</p>}</>}
              {editing === "avatar" && <AvatarPicker name={draft.full_name || "Learner"} value={draft.avatar_id ? { id: draft.avatar_id, ...(draft.avatar_theme ? { theme: draft.avatar_theme } : {}) } : null} onChange={(c) => set({ avatar_id: c?.id ?? null, avatar_theme: c?.theme ?? null })} />}
              {errors["form"] && <p role="alert" className="text-sm text-destructive">{errors["form"]}</p>}
              {confirmClose && <div role="alert" className="rounded-lg border border-primary bg-primary-soft p-3 text-sm">
                <p>Discard your unsaved changes?</p>
                <div className="mt-2 flex gap-2"><Button size="sm" variant="outline" onClick={() => setConfirmClose(false)}>Keep editing</Button><Button size="sm" variant="destructive" onClick={close}>Discard</Button></div>
              </div>}
            </div>
            <DialogFooter className="gap-2"><Button variant="outline" onClick={requestClose}>Cancel</Button><Button onClick={submit}>Save</Button></DialogFooter>
          </>}
        </DialogContent>
      </Dialog>
    </Page>
  );
}
