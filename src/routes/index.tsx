import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BookOpen, Star, Target, Search, Rocket, MessagesSquare, FileText, Briefcase, Wallet, Compass, CalendarHeart, Users, CreditCard } from "lucide-react";
import hero from "@/assets/hero-learner.jpg";
import { Page, SectionHead, EmptyState, seo } from "@/components/lws/Section";
import { CourseCard } from "@/components/lws/CourseCard";
import { categories, courses } from "@/lib/courses";

export const Route = createFileRoute("/")({
  head: () => seo("LWS — Home | Your Career, Your Next Chapter", "Continue learning, explore career courses and book counselling with Shikka on LWS."),
  component: Home,
});

const catIcons = [Rocket, MessagesSquare, FileText, Briefcase, Wallet];

function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  return (
    <Page>
      <section className="reference-banner home-banner">
        <img src={hero} alt="" width={1280} height={720} className="banner-art" />
        <div className="banner-copy">
          <p className="text-xs font-bold uppercase tracking-wider text-accent-foreground">Good to see you,</p>
          <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">
            Future <span className="text-primary">Achiever!</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground md:text-lg">Keep building your skills and moving closer to your career goals.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/courses" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lift">
              Explore Courses <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/my-learning" className="rounded-lg border border-navy/20 bg-card px-5 py-2.5 text-sm font-semibold text-navy">
              Continue Learning
            </Link>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); navigate({ to: "/courses", search: { q } }); }}
            className="mt-5 md:hidden"
          >
            <label className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3 text-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses, skills or topics…" className="w-full bg-transparent outline-none" />
            </label>
          </form>
        </div>
      </section>

      <section>
        <SectionHead icon={BookOpen} title="Continue Learning" sub="Pick up where you left off and keep making progress." to="/my-learning" />
        <EmptyState icon={BookOpen} title="No courses started yet" text="Start a course and your progress will show up here." to="/courses" cta="Explore Courses" />
      </section>

      <section>
        <SectionHead icon={Star} title="Recommended For You" sub="Popular picks to grow your career." to="/courses" cta="See All" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      </section>

      <section>
        <SectionHead icon={Target} title="Explore by career goal" sub="Choose a topic and find the right courses for you." to="/courses" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {categories.map((c, i) => {
            const Icon = catIcons[i] ?? Rocket;
            return (
              <Link key={c.name} to="/courses" search={{ cat: c.name }} className="flex flex-col items-center gap-2 rounded-lg border bg-card p-3 text-center shadow-card transition hover:-translate-y-0.5">
                <span className={`rounded-lg p-2.5 ${c.tone}`}><Icon className="h-5 w-5 text-navy" /></span>
                <span className="text-xs font-semibold text-navy sm:text-sm">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHead title="Quick actions" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            { to: "/my-learning", l: "My Learning", i: BookOpen },
            { to: "/courses", l: "Explore Courses", i: Compass },
            { to: "/counselling", l: "Career Counselling", i: CalendarHeart },
            { to: "/community", l: "Community", i: Users },
            { to: "/subscriptions", l: "Subscriptions", i: CreditCard },
          ].map((a) => (
            <Link key={a.to} to={a.to} className="flex items-center gap-3 rounded-lg border bg-card p-4 text-sm font-semibold text-navy hover:bg-primary-soft">
              <a.i className="h-5 w-5 shrink-0 text-primary" /> {a.l}
            </Link>
          ))}
        </div>
      </section>
    </Page>
  );
}
