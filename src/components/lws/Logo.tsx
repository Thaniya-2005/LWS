import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

export function Logo({ tagline = false, size = "md" }: { tagline?: boolean; size?: "md" | "lg" }) {
  const text = size === "lg" ? "text-5xl" : "text-2xl";
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="LWS home">
      <span className={`relative font-display font-extrabold tracking-tight ${text} text-navy`}>
        LW<span className="text-primary">S</span>
        <span className="text-primary">.</span>
        <GraduationCap className="absolute -right-3 -top-2 h-1/2 w-auto text-primary" aria-hidden />
      </span>
      {tagline && (
        <span className="hidden truncate text-xs text-muted-foreground xl:inline">Your Career, Your Next Chapter.</span>
      )}
    </Link>
  );
}
