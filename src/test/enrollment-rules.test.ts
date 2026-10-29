import { describe, expect, it } from "vitest";
import { canSelfEnroll } from "@/lib/enrollment-rules";

describe("Course entitlement rules", () => {
  it("allows Career Kickstart free enrolment", () => {
    expect(canSelfEnroll("career-kickstart")).toBe(true);
  });
  it("never grants paid or unknown course access through free enrolment", () => {
    for (const id of ["communication-skills", "resume-building", "linkedin-branding", "interview-preparation", "job-search-strategy", "side-hustle-starter", "unknown"]) {
      expect(canSelfEnroll(id)).toBe(false);
    }
  });
});