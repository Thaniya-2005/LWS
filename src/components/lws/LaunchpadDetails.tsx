import { useState } from "react";
import { CheckCircle2, ChevronDown, ClipboardCheck, FileText, PlayCircle, Award } from "lucide-react";
import type { launchpadDetails } from "@/lib/course-details/career-launchpad";

type D = typeof launchpadDetails;

export function LaunchpadStats({ d }: { d: D }) {
  const lessons = d.modules.reduce((n, m) => n + m.lessons.length, 0);
  const stats = [[d.duration, "Duration"], [`${d.modules.length}`, "Modules"], [`${lessons}`, "Lessons"], [d.engagement, "Total engagement"]];
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {stats.map(([v, l]) => <div key={l} className="rounded-xl border bg-card p-3 text-center"><p className="text-lg font-extrabold text-primary">{v}</p><p className="text-xs text-muted-foreground">{l}</p></div>)}
    </div>
  );
}

export function LaunchpadDetails({ d }: { d: D }) {
  const [open, setOpen] = useState<number | null>(1);
  return (
    <>
      <div className="rounded-2xl border bg-card p-5">
        <h2 className="font-bold">About this course</h2>
        <div className="mt-2 space-y-3 text-sm text-muted-foreground">{d.about.map((p) => <p key={p}>{p}</p>)}</div>
        <p className="mt-3 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Category:</span> {d.categories.primary} · {d.categories.secondary}</p>
        <p className="mt-1 text-xs text-muted-foreground"><span className="font-semibold text-foreground">{d.engagement} total engagement includes:</span> {d.engagementIncludes.join(", ")}.</p>
      </div>
      <div className="rounded-2xl border bg-card p-5">
        <h2 className="font-bold">Over 30 days, you will</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {d.outcomes.map((o) => <li key={o} className="flex items-start gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />{o}</li>)}
        </ul>
      </div>
      <div className="space-y-3">
        <div>
          <h2 className="font-bold">Curriculum</h2>
          <p className="text-sm text-muted-foreground">Quizzes: {d.quizRules.types} · Pass mark {d.quizRules.passing} · {d.quizRules.attempts} attempts</p>
        </div>
        {d.modules.map((m) => {
          const isOpen = open === m.number;
          return (
            <section key={m.number} className="overflow-hidden rounded-2xl border bg-card">
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : m.number)} className="flex w-full items-start gap-3 p-4 text-left hover:bg-muted/50">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-sm font-bold text-accent-foreground">{m.number}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">Module {m.number} — {m.title}</span>
                  <span className="block text-xs text-muted-foreground">Days {m.lessons[0].day}–{m.lessons.at(-1)!.day} · {m.lessons.length} lessons{m.quiz ? " · 1 quiz" : ""}{m.finalAssessment ? " · Final assessment" : ""}</span>
                </span>
                <ChevronDown className={`mt-1 h-5 w-5 shrink-0 transition ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="space-y-3 border-t p-4">
                  <p className="text-sm text-muted-foreground">{m.description}</p>
                  <ol className="space-y-2">
                    {m.lessons.map((l) => (
                      <li key={l.day} className="rounded-xl border p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">Day {l.day}</span>
                          <span className="min-w-0 font-semibold">{l.title}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{l.description}</p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><PlayCircle className="h-3.5 w-3.5" />{l.type} · {l.video}</span>
                          <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" />{l.activity}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                  {m.note && <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground"><strong>Important:</strong> {m.note}</p>}
                  {m.quiz && (
                    <div className="rounded-xl border border-primary/40 bg-primary-soft p-3 text-sm">
                      <p className="flex items-center gap-2 font-bold text-accent-foreground"><ClipboardCheck className="h-4 w-4" />{m.quiz.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">After Day {m.quiz.afterDay} · {m.quiz.questions} questions · Topics: {m.quiz.topics.join(", ")}</p>
                    </div>
                  )}
                  {m.finalAssessment && <p className="flex items-center gap-2 rounded-xl border border-primary/40 bg-primary-soft p-3 text-sm font-bold text-accent-foreground"><Award className="h-4 w-4" />Final Assessment — after Day 30</p>}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Resources</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">{m.resources.map((r) => <span key={r} className="rounded-full border px-2.5 py-1 text-xs">{r}</span>)}</div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
