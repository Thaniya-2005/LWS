import urls from "./avatar-urls.json";

export type AvatarCategory = "illustrative" | "fun" | "cute" | "pets" | "ai" | "initials";
export type Avatar = { id: string; name: string; category: AvatarCategory; group?: string | undefined; image: string; type: "image" };

const u = urls as Record<string, string>;
const mk = (category: AvatarCategory, list: [string, string][], group?: string): Avatar[] =>
  list.map(([key, name]) => ({ id: `${category}:${key}`, name, category, group, image: u[key] ?? "", type: "image" }));
const seq = (p: string, label: string) => Array.from({ length: 7 }, (_, i) => [`${p}-${i + 1}`, `${label} ${i + 1}`] as [string, string]);

export const avatarGroups = [
  { id: "students", title: "Students", sub: "Learning today, a brighter tomorrow", items: mk("illustrative", seq("student", "Student"), "students") },
  { id: "pros", title: "Professionals", sub: "Build. Grow. Make an Impact.", items: mk("illustrative", seq("pro", "Pro"), "pros") },
  { id: "creative", title: "Creative", sub: "Ideas. Imagination. You.", items: mk("illustrative", seq("creative", "Creative"), "creative") },
];

const named = (keys: string) => keys.split(",").map((k) => [k, k.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())] as [string, string]);

export const avatarCategories: { id: AvatarCategory; label: string; items: Avatar[] }[] = [
  { id: "illustrative", label: "Illustrative Avatars", items: avatarGroups.flatMap((g) => g.items) },
  { id: "fun", label: "Fun Avatars", items: mk("fun", named("happy,chill,gamer,foodie,sleepy,goofy,meme,overthinker,music,traveller,selfie,sarcastic")) },
  { id: "cute", label: "Cute Avatars", items: mk("cute", named("star,cloud,sun,moon,flower,plant,rainbow,cupcake,boba,bow,cute-panda,heart").map(([k, n]) => [k, n === "Cute Panda" ? "Panda" : n] as [string, string])) },
  { id: "pets", label: "Pet Companions", items: mk("pets", named("dog,cat,bird,rabbit,fox,turtle,panda,penguin,hamster,unicorn,husky,dragon")) },
  { id: "ai", label: "AI Avatars", items: mk("ai", [["lumi", "Lumi"], ["zara", "Zara"], ["orion", "Orion"], ["patch", "Patch"], ["bolt", "Bolt"], ["nebula", "Nebula"], ["prof-pixel", "Prof. Pixel"], ["kiko", "Kiko"], ["zen", "Zen"], ["sage", "Sage"], ["byte", "Byte"], ["mira", "Mira"]]) },
  { id: "initials", label: "Initials", items: [] },
];

export type Theme = { id: string; name: string; bg: string; fg: string };
export const initialsThemes: Theme[] = [
  { id: "gold", name: "Gold", bg: "#D9A514", fg: "#FFFFFF" },
  { id: "charcoal", name: "Charcoal", bg: "#3A3328", fg: "#FFFFFF" },
  { id: "slate", name: "Slate", bg: "#3F4442", fg: "#FFFFFF" },
  { id: "warm-amber", name: "Warm Amber", bg: "#FFF4D6", fg: "#B7860B" },
  { id: "emerald", name: "Emerald", bg: "#2E5E4A", fg: "#FFFFFF" },
  { id: "royal-blue", name: "Royal Blue", bg: "#2C3E73", fg: "#FFFFFF" },
  { id: "crimson", name: "Crimson", bg: "#8E2440", fg: "#FFFFFF" },
  { id: "terracotta", name: "Terracotta", bg: "#A44A2A", fg: "#FFFFFF" },
  { id: "teal", name: "Teal", bg: "#1D5459", fg: "#FFFFFF" },
  { id: "plum", name: "Plum", bg: "#4A2448", fg: "#FFFFFF" },
  { id: "navy", name: "Navy", bg: "#17233F", fg: "#FFFFFF" },
  { id: "rose-soft", name: "Rose Soft", bg: "#FDECEF", fg: "#8E2440" },
];

const all = new Map(avatarCategories.flatMap((c) => c.items).map((a) => [a.id, a]));
export const getAvatar = (id?: string | null) => (id ? all.get(id) : undefined);
export const getTheme = (id?: string | null) => initialsThemes.find((t) => t.id === id);

/** First + last name word; a single word gives one letter. */
export function nameInitials(name: string) {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (!w.length) return "L";
  const first = w[0]!.charAt(0);
  return (w.length > 1 ? first + w[w.length - 1]!.charAt(0) : first).toUpperCase();
}

/** Selection stored on the profile: avatar_id is an image id or "initials"; avatar_theme set for initials. */
export type AvatarChoice = { id: string; theme?: string } | null;
export function choiceLabel(c: AvatarChoice) {
  if (!c) return "";
  if (c.id === "initials") return `Initials (${getTheme(c.theme)?.name ?? ""})`;
  return getAvatar(c.id)?.name ?? "";
}
