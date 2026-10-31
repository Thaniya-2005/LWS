import { memo, useRef, useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { avatarCategories, avatarGroups, initialsThemes, nameInitials, type Avatar, type AvatarCategory, type AvatarChoice } from "@/lib/avatars";

const Tile = memo(function Tile({ a, on, toggle }: { a: Avatar; on: boolean; toggle: (id: string) => void }) {
  return (
    <button type="button" role="radio" aria-checked={on} aria-label={a.name} onClick={() => toggle(a.id)}
      className="group flex min-w-0 flex-col items-center gap-1.5 rounded-xl p-1 outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <span className={`relative block aspect-square w-full max-w-[84px] rounded-full border-2 transition-colors ${on ? "border-primary ring-2 ring-primary/30" : "border-transparent group-hover:border-primary/40"}`}>
        <img src={a.image} alt="" width={84} height={84} loading="lazy" className="h-full w-full rounded-full object-cover"
          onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />
        {on && <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-3 w-3" /></span>}
      </span>
      <span className={`truncate text-xs sm:text-sm ${on ? "font-semibold text-foreground" : "text-foreground/80"}`}>{a.name}</span>
    </button>
  );
});

const Grid = ({ items, sel, toggle }: { items: Avatar[]; sel: string | undefined; toggle: (id: string) => void }) => (
  <div role="radiogroup" className="grid grid-cols-3 gap-x-2 gap-y-3 min-[360px]:grid-cols-4">
    {items.map((a) => <Tile key={a.id} a={a} on={sel === a.id} toggle={toggle} />)}
  </div>
);

function ToggleMore({ open, extra, onClick, block }: { open: boolean; extra: number; onClick: () => void; block?: boolean }) {
  return (
    <button type="button" onClick={onClick} aria-expanded={open}
      className={`inline-flex items-center justify-center gap-1 text-sm font-semibold text-primary ${block ? "mt-4 w-full rounded-xl border border-primary/30 bg-primary-soft/40 py-2" : ""}`}>
      {open ? <>Show less <ChevronUp className="h-4 w-4" /></> : <>Show more ({extra}) <ChevronDown className="h-4 w-4" /></>}
    </button>
  );
}

export function AvatarPicker({ name, value, onChange }: { name: string; value: AvatarChoice; onChange: (c: AvatarChoice) => void }) {
  const [cat, setCat] = useState<AvatarCategory>("illustrative");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const row = useRef<HTMLDivElement>(null);
  const sel = value?.id;
  const toggle = (id: string) => onChange(sel === id ? null : { id });
  const flip = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  const scroll = (d: number) => row.current?.scrollBy({ left: d * 160, behavior: "smooth" });
  const pick = (id: AvatarCategory) => {
    setCat(id);
    row.current?.querySelector(`[data-cat="${id}"]`)?.scrollIntoView?.({ inline: "center", block: "nearest", behavior: "smooth" });
  };
  const ini = nameInitials(name);
  const current = avatarCategories.find((c) => c.id === cat)!;

  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1">
        <button type="button" aria-label="Previous categories" onClick={() => scroll(-1)} className="shrink-0 rounded-full p-1.5 hover:bg-muted"><ChevronLeft className="h-4 w-4" /></button>
        <div ref={row} role="tablist" className="flex min-w-0 flex-1 gap-2 overflow-x-auto scroll-smooth py-1 [scrollbar-width:none]">
          {avatarCategories.map((c) => (
            <button key={c.id} data-cat={c.id} type="button" role="tab" aria-selected={cat === c.id} onClick={() => pick(c.id)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${cat === c.id ? "border-primary bg-primary font-semibold text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/40"}`}>{c.label}</button>
          ))}
        </div>
        <button type="button" aria-label="Next categories" onClick={() => scroll(1)} className="shrink-0 rounded-full p-1.5 hover:bg-muted"><ChevronRight className="h-4 w-4" /></button>
      </div>

      <div className="mt-4">
        {cat === "illustrative" && (
          <div className="space-y-4">
            {avatarGroups.map((g) => (
              <section key={g.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div><h3 className="font-semibold text-foreground">{g.title} ({g.items.length})</h3><p className="text-xs text-muted-foreground">{g.sub}</p></div>
                  <ToggleMore open={!!open[g.id]} extra={g.items.length - 4} onClick={() => flip(g.id)} />
                </div>
                <Grid items={open[g.id] ? g.items : g.items.slice(0, 4)} sel={sel} toggle={toggle} />
              </section>
            ))}
          </div>
        )}

        {cat !== "illustrative" && cat !== "initials" && (
          <>
            <Grid items={open[cat] ? current.items : current.items.slice(0, 8)} sel={sel} toggle={toggle} />
            <ToggleMore block open={!!open[cat]} extra={current.items.length - 8} onClick={() => flip(cat)} />
          </>
        )}

        {cat === "initials" && (() => {
          const th = initialsThemes.find((t) => sel === "initials" && t.id === value?.theme) ?? initialsThemes[0]!;
          return (
            <div>
              <div className="flex flex-col items-center text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold" style={{ background: th.bg, color: th.fg }}>{ini}</span>
                <p className="mt-3 font-semibold text-foreground">{name || "Your name"}</p>
                <p className="text-xs text-muted-foreground">Initials: <span className="font-semibold text-primary">{ini}</span> · Tap a color theme below to select</p>
              </div>
              <p className="mb-2 mt-5 text-sm font-semibold text-foreground">Choose Color Theme ({initialsThemes.length}):</p>
              <div role="radiogroup" className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {initialsThemes.map((t) => {
                  const on = sel === "initials" && value?.theme === t.id;
                  return (
                    <button key={t.id} type="button" role="radio" aria-checked={on} aria-label={`${t.name} initials theme`}
                      onClick={() => onChange(on ? null : { id: "initials", theme: t.id })}
                      className={`flex min-w-0 flex-col items-center gap-1.5 rounded-xl border p-3 outline-none focus-visible:ring-2 focus-visible:ring-primary ${on ? "border-primary bg-primary-soft" : "border-border bg-card hover:border-primary/40"}`}>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/5 text-xs font-bold" style={{ background: t.bg, color: t.fg }}>{ini}</span>
                      <span className="w-full truncate text-xs text-foreground">{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
