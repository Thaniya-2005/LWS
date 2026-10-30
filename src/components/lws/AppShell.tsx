import { UserAvatar } from "@/components/lws/UserAvatar";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell, BookOpen, Compass, CalendarHeart, Home, Sparkles, Users, LifeBuoy,
  CreditCard, User, Settings, LogIn, LogOut, Search, PanelLeftClose, PanelLeftOpen, MessagesSquare,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { displayName, useAuth } from "@/hooks/use-auth";

type Item = { to: string; label: string; icon: typeof Home; soon?: boolean };

const groups: { label: string; items: Item[] }[] = [
  {
    label: "Main",
    items: [
      { to: "/", label: "Home", icon: Home },
      { to: "/my-learning", label: "My Learning", icon: BookOpen },
      { to: "/courses", label: "Explore Courses", icon: Compass },
      { to: "/counselling", label: "Career Counselling", icon: CalendarHeart },
    ],
  },
  {
    label: "Community & Support",
    items: [
      { to: "/ai", label: "AI with Shikkha", icon: Sparkles, soon: true },
      { to: "/community", label: "Community", icon: Users },
      { to: "/help", label: "Help & Support", icon: LifeBuoy },
    ],
  },
  {
    label: "Account & Plans",
    items: [
      { to: "/subscriptions", label: "Subscriptions", icon: CreditCard },
      { to: "/profile", label: "Profile", icon: User },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

const mobileNav: Item[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/my-learning", label: "My Learning", icon: BookOpen },
  { to: "/courses", label: "Courses", icon: Compass },
  { to: "/counselling", label: "Counselling", icon: MessagesSquare },
  { to: "/profile", label: "Profile", icon: User },
];

function isActive(path: string, to: string) {
  return to === "/" ? path === "/" : path === to || path.startsWith(to + "/");
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, profile, ready, signOut } = useAuth();
  const [accountError, setAccountError] = useState("");
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/courses", search: { q } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
        <div className="grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="ghost" size="icon"
              title={collapsed ? "Expand menu" : "Collapse menu"}
              onClick={() => setCollapsed((c) => !c)}
              className="hidden rounded-lg p-2 text-navy hover:bg-muted md:inline-flex"
              aria-label={collapsed ? "Expand menu" : "Collapse menu"}
            >
              {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </Button>
            <Logo tagline />
          </div>
          <form onSubmit={onSearch} className="hidden max-w-xl md:block md:w-full md:justify-self-center">
            <label className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-sm">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for courses, skills or career topics…"
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
                aria-label="Search courses"
              />
            </label>
          </form>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link to="/courses" className="rounded-lg p-2 text-navy hover:bg-muted md:hidden" aria-label="Search">
              <Search className="h-5 w-5" />
            </Link>
            <Button variant="ghost" size="icon" title="No notifications" aria-label="Notifications (none)">
              <Bell className="h-5 w-5" />
            </Button>
            {ready && user ? <>
              <Button asChild variant="ghost" size="icon"><Link to="/profile" aria-label="Your profile" title={displayName(profile, user)}><UserAvatar name={displayName(profile, user)} avatarId={profile?.avatar_id} theme={profile?.avatar_theme} size={36} /></Link></Button>
              <Button variant="ghost" size="icon" title="Sign out" aria-label="Sign out" onClick={() => { void signOut().catch(() => setAccountError("Couldn't sign out. Please try again.")); }}><LogOut className="h-5 w-5" /></Button>
            </> : <Button asChild variant="ghost" disabled={!ready} className="h-auto p-0"><Link
              to="/login"
              className="ml-1 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <LogIn className="h-4 w-4" /> <span className="hidden sm:inline">Sign in</span>
            </Link></Button>}
          </div>
        </div>
      </header>
      {accountError && <p role="alert" className="px-4 py-2 text-sm text-destructive">{accountError}</p>}

      <div className="flex">
        {/* Sidebar tablet/desktop */}
        <aside
          className={`sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 overflow-y-auto border-r bg-sidebar transition-all md:block ${
            collapsed ? "w-[72px]" : "w-[72px] lg:w-[216px]"
          }`}
        >
          <nav className="flex flex-col gap-5 px-3 py-5" aria-label="Main navigation">
            {groups.map((g) => (
              <div key={g.label} className="border-b pb-4 last:border-b-0">
                <p className={`mb-3 px-3 text-[10px] font-semibold uppercase text-muted-foreground ${collapsed ? "hidden" : "hidden lg:block"}`}>
                  {g.label}
                </p>
                {g.items.map((it) => {
                  const active = isActive(path, it.to);
                  return (
                    <Link
                      key={it.to}
                      to={it.to}
                      title={it.label}
                      className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-muted"
                      }`}
                    >
                      <it.icon className="h-5 w-5 shrink-0" />
                      <span className={`${collapsed ? "hidden" : "hidden lg:inline"} truncate`}>{it.label}</span>
                      {it.soon && (
                        <span className={`${collapsed ? "hidden" : "hidden lg:inline"} ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground`}>
                          Soon
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 pb-safe-nav md:pb-10">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="Primary"
      >
        <div className="grid grid-cols-5">
          {mobileNav.map((it) => {
            const active = isActive(path, it.to);
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span className={`rounded-lg px-3 py-1 ${active ? "bg-primary-soft" : ""}`}>
                  <it.icon className="h-5 w-5" />
                </span>
                {it.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export const accountLinks = groups.slice(1).flatMap((g) => g.items);
