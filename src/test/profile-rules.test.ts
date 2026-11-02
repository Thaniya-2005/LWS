import { describe, expect, it } from "vitest";
import { parseProfileOverrides, profileCompletion, type LearnerProfile } from "@/lib/profile-rules";
const full: LearnerProfile = { full_name: "A B", phone: "", skills_to_improve: ["Communication Skills"], skills_other: "", learning_goals: ["Start My Career"], experience_level: "Beginner", career_stage: "Job Seeker", career_interests: ["X"], about_me: "", avatar_id: null, avatar_theme: null };
describe("profile completion", () => {
  it("reaches 100% without optional avatar and About Me", () => expect(profileCompletion(full, "a@b.co")).toBe(100));
  it("counts Other skill incomplete without text", () => expect(profileCompletion({ ...full, skills_to_improve: ["Other"] }, "a@b.co")).toBe(86));
  it("never accepts email or id overrides", () => expect(parseProfileOverrides('{"email":"x","id":"y","full_name":"Z"}')).toEqual({ full_name: "Z" }));
});
