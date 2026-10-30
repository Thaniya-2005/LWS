import { describe, expect, it } from "vitest";
import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { AvatarPicker } from "@/components/lws/AvatarPicker";
import type { AvatarChoice } from "@/lib/avatars";

let last: AvatarChoice = null;
function Host() { const [v, setV] = useState<AvatarChoice>(null); last = v; return <AvatarPicker name="Vemula Sri Krishna Thaniya" value={v} onChange={setV} />; }

describe("AvatarPicker", () => {
  it("keeps one selection across categories and toggles off", () => {
    render(<Host />);
    expect(screen.queryByRole("radio", { name: "Student 5" })).toBeNull();
    fireEvent.click(screen.getAllByText(/Show more/)[0]!);
    fireEvent.click(screen.getByRole("radio", { name: "Student 5" }));
    expect(last).toEqual({ id: "illustrative:student-5" });
    fireEvent.click(screen.getByRole("tab", { name: "Pet Companions" }));
    fireEvent.click(screen.getByRole("radio", { name: "Dog" }));
    expect(last).toEqual({ id: "pets:dog" });
    fireEvent.click(screen.getByRole("radio", { name: "Dog" }));
    expect(last).toBeNull();
    fireEvent.click(screen.getByRole("tab", { name: "Initials" }));
    expect(screen.getAllByText("VT").length).toBeGreaterThan(12);
    fireEvent.click(screen.getByRole("radio", { name: "Emerald initials theme" }));
    expect(last).toEqual({ id: "initials", theme: "emerald" });
  });
});
