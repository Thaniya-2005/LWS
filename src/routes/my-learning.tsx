import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Page, PageTitle, EmptyState, seo } from "@/components/lws/Section";
import { useAuth } from "@/hooks/use-auth";
import { CourseCard } from "@/components/lws/CourseCard";
import { courses } from "@/lib/courses";

export const Route = createFileRoute("/my-learning")({
  head: () => seo("My Learning — LWS", "Your enrolled LWS courses and learning progress."),
  component: MyLearning,
});

const tabs = ["All", "In Progress", "Completed"] as const;

function MyLearning() {
  const { ready, user, enrollments, error, refresh } = useAuth();
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const matchesTab = (e: (typeof enrollments)[number], t: (typeof tabs)[number]) => t === "All" || (t === "Completed" ? e.progress === 100 : e.progress < 100);
  const visible = enrollments.filter((e) => matchesTab(e, tab));
  return (
    <Page>
      <PageTitle title="My Learning" sub="Your enrolled courses and progress." />
      <div className="flex gap-2">
        {tabs.map((t) => (
          <Button variant="ghost" key={t} onClick={() => setTab(t)} className={`rounded-full border px-4 py-1.5 text-sm font-medium ${tab === t ? "border-primary bg-primary text-primary-foreground" : "bg-card text-navy"}`}>
            {t} ({enrollments.filter((e) => matchesTab(e, t)).length})
          </Button>
        ))}
      </div>
      {!ready ? <p role="status">Loading your courses…</p> : error ? <div role="alert"><p className="text-destructive">{error}</p><Button variant="outline" onClick={() => void refresh()}>Try again</Button></div> : visible.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visible.map((e) => {
        const course = courses.find((c) => c.id === e.course_id);
        if (!course) return null;
        return <div key={e.id} className="space-y-2"><CourseCard course={course} /><p className="text-sm text-muted-foreground">{e.progress === 100 ? "Completed" : `${e.progress}% complete`}</p><progress aria-label={`${course.title} progress`} value={e.progress} max={100} className="h-2 w-full accent-primary" /></div>;
      })}</div> : <EmptyState icon={BookOpen} title={enrollments.length ? "No courses in this view" : "You haven't enrolled in any courses yet"} text={user ? "Explore the courses and enrol to save them here." : "Sign in and start a course — your enrolments will be saved here."} to={user ? "/courses" : "/login"} cta={user ? "Explore Courses" : "Sign in"} />}
    </Page>
  );
}
