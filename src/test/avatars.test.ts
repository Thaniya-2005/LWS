import { describe, expect, it } from "vitest";
import { avatarCategories, avatarGroups, initialsThemes, nameInitials } from "@/lib/avatars";
describe("avatars", () => {
  it("uses first and last name for initials", () => expect(nameInitials("  Vemula Sri Krishna  Thaniya ")).toBe("VT"));
  it("uses one letter for a single name", () => expect(nameInitials("priya")).toBe("P"));
  it("has 12 initials themes", () => expect(initialsThemes).toHaveLength(12));
  it("has 7 avatars per illustrative group", () => avatarGroups.forEach((g) => expect(g.items).toHaveLength(7)));
  it("every image avatar has a picture and unique id", () => {
    const items = avatarCategories.flatMap((c) => c.items);
    expect(items.every((a) => a.image)).toBe(true);
    expect(new Set(items.map((a) => a.id)).size).toBe(items.length);
  });
});
