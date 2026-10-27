import { Link } from "@tanstack/react-router";
import logo from "@/assets/lws-logo.png.asset.json";

export function Logo({ tagline = false, size = "md" }: { tagline?: boolean; size?: "md" | "lg" }) {
  return (
    <Link to="/" className="flex min-w-0 items-center" aria-label="LWS home">
      <img
        src={logo.url}
        alt="LWS — Learn with Shikkha"
        className={size === "lg" ? "h-20 w-auto" : "h-11 w-auto"}
      />
      {tagline && <span className="sr-only">Skills Today · Brighter Tomorrow</span>}
    </Link>
  );
}
