import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowRight, BarChart3, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Course, formatPrice } from "@/lib/courses";
import { useAuth } from "@/hooks/use-auth";
import { enrollFreeCourse } from "@/lib/enrollments.functions";

export function AccessBadge({ course }: { course: Course }) {
  const map = {
    free: ["Free", "bg-success-soft text-success"],
    paid: ["Paid", "bg-primary-soft text-accent-foreground"],
    locked: ["Locked", "bg-muted text-muted-foreground"],
    "coming-soon": ["Coming Soon", "bg-navy text-primary-foreground"],
  } as const;
  const [label, cls] = map[course.access];
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${cls}`}>{label}</span>;
}

export function CourseCard({ course }: { course: Course }) {
  const soon = course.access === "coming-soon";
  return (
    <article className={`group flex flex-col overflow-hidden rounded-lg border bg-card shadow-card transition hover:-translate-y-0.5 hover:shadow-lift ${soon ? "opacity-80" : ""}`}>
      <Link to="/courses/$courseId" params={{ courseId: course.id }} className="relative block aspect-video overflow-hidden bg-muted">
        <img src={course.thumbnail} alt={course.title} loading="lazy" className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute left-3 top-3 flex gap-1.5"><AccessBadge course={course} />{course.premium && <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">Premium</span>}</div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-accent-foreground">{course.category}</span>
        <h3 className="line-clamp-2 text-base font-bold leading-snug">{course.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1"><BarChart3 className="h-3.5 w-3.5" />{course.level}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</span>
          </span>
          <span className={`text-base font-bold ${course.price === 0 ? "text-success" : "text-navy"}`}>{formatPrice(course.price)}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Link to="/courses/$courseId" params={{ courseId: course.id }} className="rounded-lg border px-3 py-2 text-center text-sm font-semibold text-navy hover:bg-muted">
            View Details
          </Link>
          <CourseAction course={course} />
        </div>
      </div>
    </article>
  );
}

export function CourseAction({ course }: { course: Course }) {
  const { user, enrollments, ready, refresh } = useAuth();
  const enroll = useServerFn(enrollFreeCourse);
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const base = "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold";
  if (enrollments.some((e) => e.course_id === course.id)) {
    return <Button asChild className={base}><Link to="/courses/$courseId" params={{ courseId: course.id }}>View Course <ArrowRight /></Link></Button>;
  }
  if (course.access === "coming-soon")
    return <Button disabled className={`${base} cursor-not-allowed bg-muted text-muted-foreground`}>Coming Soon</Button>;
  if (course.access !== "free") return <Button disabled variant="secondary" className={base}><Lock className="h-4 w-4" /> Payment opening soon</Button>;
  if (ready && user) return <div className="min-w-0"><Button disabled={busy} className={`${base} w-full`} onClick={async () => {
    setBusy(true); setError("");
    try { await enroll({ data: { courseId: course.id } }); await refresh(); await navigate({ to: "/my-learning" }); }
    catch { setError("Couldn't enrol. Please try again."); }
    finally { setBusy(false); }
  }}>{busy ? "Enrolling…" : "Enroll Free"}<ArrowRight /></Button>{error && <p role="alert" className="mt-2 text-xs text-destructive">{error}</p>}</div>;
  return (
    <Button asChild className={base}><Link to="/login" search={{ course: course.id }}>Sign in <ArrowRight className="h-4 w-4" /></Link></Button>
  );
}
