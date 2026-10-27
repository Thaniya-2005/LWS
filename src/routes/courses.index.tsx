import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Page, PageTitle, seo } from "@/components/lws/Section";
import { CourseCard } from "@/components/lws/CourseCard";
import { categories, courses } from "@/lib/courses";

type S = { q?: string | undefined; cat?: string | undefined; price?: "free" | "paid" | undefined; sort?: "low" | "high" | undefined };

export const Route = createFileRoute("/courses/")({
  validateSearch: (s: { q?: unknown; cat?: unknown; price?: unknown; sort?: unknown }): S => ({
    q: typeof s.q === "string" ? s.q : undefined,
    cat: typeof s.cat === "string" ? s.cat : undefined,
    price: s.price === "free" || s.price === "paid" ? s.price : undefined,
    sort: s.sort === "low" || s.sort === "high" ? s.sort : undefined,
  }),
  head: () => seo("Explore Courses — LWS", "Browse LWS career courses: communication, resumes, LinkedIn, interviews, job search and more."),
  component: Courses,
});

function Courses() {
  const s = Route.useSearch();
  const navigate = Route.useNavigate();
  const set = (patch: Partial<S>) => navigate({ search: (p) => ({ ...p, ...patch }), replace: true });

  const list = useMemo(() => {
    let r = courses.filter((c) =>
      (!s.q || (c.title + c.description + c.category).toLowerCase().includes(s.q.toLowerCase())) &&
      (!s.cat || c.category === s.cat) &&
      (!s.price || (s.price === "free" ? c.price === 0 : c.price > 0)),
    );
    if (s.sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    if (s.sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [s]);

  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${active ? "border-primary bg-primary text-primary-foreground" : "bg-card text-navy hover:bg-muted"}`;
  const filtered = !!(s.q || s.cat || s.price || s.sort);

  return (
    <Page>
      <PageTitle title="Explore Courses" sub="Learn new skills, build your profile, and get job-ready with expert-curated courses." />

      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
          <label className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={s.q ?? ""} onChange={(e) => set({ q: e.target.value || undefined })} placeholder="Search courses…" className="w-full bg-transparent outline-none" />
          </label>
          <select value={s.price ?? ""} onChange={(e) => set({ price: (e.target.value || undefined) as S["price"] })} className="rounded-lg border bg-card px-3 py-2.5 text-sm" aria-label="Price">
            <option value="">All prices</option><option value="free">Free</option><option value="paid">Paid</option>
          </select>
          <select value={s.sort ?? ""} onChange={(e) => set({ sort: (e.target.value || undefined) as S["sort"] })} className="rounded-lg border bg-card px-3 py-2.5 text-sm" aria-label="Sort">
            <option value="">Popular</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option>
          </select>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
          <Button variant="ghost" className={chip(!s.cat)} onClick={() => set({ cat: undefined })}>All Courses</Button>
          {categories.map((c) => (
            <Button variant="ghost" key={c.name} className={chip(s.cat === c.name)} onClick={() => set({ cat: c.name })}>{c.name}</Button>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{list.length} course{list.length === 1 ? "" : "s"}</span>
          {filtered && (
            <Link to="/courses" search={{}} className="flex items-center gap-1 font-semibold text-primary"><X className="h-4 w-4" /> Clear filters</Link>
          )}
        </div>
      </div>

      {list.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">No courses match these filters.</p>
      )}
    </Page>
  );
}
