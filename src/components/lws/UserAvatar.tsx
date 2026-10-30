import { useState } from "react";
import { getAvatar, getTheme, nameInitials } from "@/lib/avatars";

export function UserAvatar({ name, avatarId, theme, size = 36, className = "" }: { name: string; avatarId?: string | null | undefined; theme?: string | null | undefined; size?: number; className?: string }) {
  const [broken, setBroken] = useState(false);
  const a = getAvatar(avatarId);
  const style = { width: size, height: size, fontSize: size * 0.36 };
  if (a && !broken)
    return <img src={a.image} alt={`${name}'s avatar`} width={size} height={size} onError={() => setBroken(true)} className={`shrink-0 rounded-full object-cover ${className}`} style={style} />;
  const t = avatarId === "initials" ? getTheme(theme) : undefined;
  return (
    <span aria-label={`${name}'s avatar`} className={`flex shrink-0 items-center justify-center rounded-full font-bold ${t ? "" : "bg-primary-soft text-accent-foreground"} ${className}`}
      style={t ? { ...style, background: t.bg, color: t.fg } : style}>{nameInitials(name)}</span>
  );
}
