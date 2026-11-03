import { describe, expect, it } from "vitest";
import { canSelfEnroll } from "@/lib/enrollment-rules";

describe("Course entitlement rules", () => {
  it("allows Career Kickstart free enrolment", () => {
    expect(canSelfEnroll("career-kickstart")).toBe(true);
  });
  it("never grants paid or unknown course access through free enrolment", () => {
    for (const id of ["career-launchpad", "communication-skills", "resume-building", "linkedin-branding", "interview-preparation", "job-search-strategy", "side-hustle-starter", "unknown"]) {
      expect(canSelfEnroll(id)).toBe(false);
    }
  });
  it("only Kickstart and Launchpad are available; Launchpad costs ₹5,999", async () => {
    const { courses } = await import("@/lib/courses");
    expect(courses.filter((c) => c.access !== "coming-soon").map((c) => c.id)).toEqual(["career-kickstart", "career-launchpad"]);
    expect(courses.find((c) => c.id === "career-launchpad")?.price).toBe(5999);
  });
});