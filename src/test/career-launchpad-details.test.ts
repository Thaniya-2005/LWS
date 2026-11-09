import { describe, expect, it } from "vitest";
import { getCourseDetails, launchpadDetails as d } from "@/lib/course-details/career-launchpad";
describe("Career Launchpad details", () => {
  it("has 6 modules, 30 lessons on days 1–30, 5 quizzes", () => {
    expect(d.modules).toHaveLength(6);
    expect(d.modules.flatMap((m) => m.lessons).map((l) => l.day)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
    expect(d.modules.filter((m) => m.quiz).map((m) => m.quiz!.questions)).toEqual([8, 6, 10, 8, 6]);
    expect(d.quizRules).toEqual({ types: "MCQ & True or False", passing: "55%", attempts: 2 });
  });
  it("applies only to Career Launchpad", () => {
    expect(getCourseDetails("career-kickstart")).toBeUndefined();
  });
});
