import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, BarChart3, Bookmark, CheckCircle2, Clock, Lock } from "lucide-react";
import { Page } from "@/components/lws/Section";
import { AccessBadge, CourseAction } from "@/components/lws/CourseCard";
import { formatPrice, getCourse } from "@/lib/courses";
import { useAuth } from "@/hooks/use-auth";
import { getCourseDetails } from "@/lib/course-details/career-launchpad";
import { LaunchpadDetails, LaunchpadStats } from "@/components/lws/LaunchpadDetails";

export const Route = createFileRoute("/courses/$courseId")({
  loader: ({ params }) => {
    const course = getCourse(params.courseId);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.course.title} — LWS` : "Course — LWS";
    const d = loaderData?.course.description ?? "LWS career course.";
    return {
      meta: [
        { title: t }, { name: "description", content: d },
        { property: "og:title", content: t }, { property: "og:description", content: d },
        { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData?.course.thumbnail.startsWith("https://") ? [{ property: "og:image", content: loaderData.course.thumbnail }, { name: "twitter:image", content: loaderData.course.thumbnail }] : []),
      ],
    };
  },
  component: Detail,
});

function Detail() {
  const { course } = Route.useLoaderData();
  const { user, enrollments } = useAuth();
  const details = getCourseDetails(course.id);
  const enrolled = enrollments.some((e) => e.course_id === course.id);
  return (
    <Page>
      <Link to="/courses" className="inline-flex items-center gap-1 text-sm font-semibold text-navy"><ArrowLeft className="h-4 w-4" /> Back to courses</Link>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <img src={course.thumbnail} alt={course.title} className="aspect-[3/2] w-full rounded-2xl object-cover shadow-card" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">{course.category}</span>
              <AccessBadge course={course} />
            </div>
            <h1 className="mt-2 text-2xl font-extrabold md:text-3xl">{course.title}</h1>
            <p className="mt-2 text-muted-foreground">{details?.shortDescription ?? course.description}</p>
          </div>
          {details && <LaunchpadStats d={details} />}
          {details ? <LaunchpadDetails d={details} /> : <>
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="font-bold">What you'll learn</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />{o}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="font-bold">Curriculum</h2>
            <p className="mt-2 text-sm text-muted-foreground">The full module and lesson list will appear here once the course content is published.</p>
          </div>
          </>}
        </div>
        <aside className="h-fit space-y-4 rounded-2xl border bg-card p-5 shadow-card lg:sticky lg:top-20">
          <div className="flex items-center justify-between">
            <span className={`text-3xl font-extrabold ${course.price === 0 ? "text-success" : "text-navy"}`}>{formatPrice(course.price)}</span>
            <button className="rounded-lg p-2 hover:bg-muted" aria-label="Bookmark"><Bookmark className="h-5 w-5 text-primary" /></button>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><BarChart3 className="h-4 w-4" />{course.level}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{course.duration}</span>
          </div>
          {course.access === "locked" && (
            <p className="flex items-center gap-2 rounded-xl bg-muted p-3 text-sm text-muted-foreground"><Lock className="h-4 w-4" /> Access locked — sign in and purchase to unlock.</p>
          )}
          <div className="grid"><CourseAction course={course} /></div>
          <p className="text-xs text-muted-foreground">{enrolled ? "You're enrolled. Lessons will appear here when course content is published." : course.price === 0 ? user ? "Save this free course to My Learning. Lessons are not published yet." : "Sign in to enrol in this free course." : "Purchases are not available yet. Paid access requires confirmed payment."}</p>
        </aside>
      </div>
    </Page>
  );
}
