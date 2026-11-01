export type LearnerProfile = {
  full_name: string;
  phone: string;
  skills_to_improve: string[];
  skills_other: string;
  learning_goals: string[];
  experience_level: string;
  career_stage: string;
  career_interests: string[];
  about_me: string;
  avatar_id: string | null;
  avatar_theme: string | null;
};

export type ProfileSection = "personal" | "skills" | "goals" | "experience" | "stage" | "interests" | "avatar";
export const skillOptions = ["Resume Preparation", "Personal Interview Skills", "Group Discussion Skills", "Communication Skills", "Professional Confidence", "Other"];
export const goalOptions = ["Start My Career", "Improve My Skills", "Prepare for Interviews", "Build Professional Confidence", "Improve Communication", "Get Placement Ready"];
export const experienceOptions = ["Beginner", "Intermediate", "Advanced"];
export const stageOptions = ["College Student", "Recent Graduate", "Job Seeker", "Working Professional"];

export function profileRequirements(profile: LearnerProfile, email: string) {
  return [
    { field: "full_name", section: "personal" as const, label: "Full name", complete: Boolean(profile.full_name.trim()) },
    { field: "email", section: "personal" as const, label: "Account email", complete: Boolean(email.trim()) },
    { field: "skills_to_improve", section: "skills" as const, label: "Skills to improve", complete: profile.skills_to_improve.length > 0 && (!profile.skills_to_improve.includes("Other") || Boolean(profile.skills_other.trim())) },
    { field: "learning_goals", section: "goals" as const, label: "Learning goals", complete: profile.learning_goals.length > 0 },
    { field: "experience_level", section: "experience" as const, label: "Experience level", complete: Boolean(profile.experience_level) },
    { field: "career_stage", section: "stage" as const, label: "Career stage", complete: Boolean(profile.career_stage) },
    { field: "career_interests", section: "interests" as const, label: "Career interests", complete: profile.career_interests.length > 0 },
  ];
}

export function profileCompletion(profile: LearnerProfile, email: string) {
  const required = profileRequirements(profile, email);
  return Math.round(required.filter((field) => field.complete).length / required.length * 100);
}

export function validateProfileSection(profile: LearnerProfile, section: ProfileSection): Record<string, string> {
  const errors: Record<string, string> = {};
  if (section === "personal" && !profile.full_name.trim()) errors["full_name"] = "Enter your full name.";
  if (section === "skills") {
    if (!profile.skills_to_improve.length) errors["skills_to_improve"] = "Select at least one skill.";
    if (profile.skills_to_improve.includes("Other") && !profile.skills_other.trim()) errors["skills_other"] = "Tell us the other skill you want to improve.";
  }
  if (section === "goals" && !profile.learning_goals.length) errors["learning_goals"] = "Select at least one learning goal.";
  if (section === "experience" && !profile.experience_level) errors["experience_level"] = "Choose your experience level.";
  if (section === "stage" && !profile.career_stage) errors["career_stage"] = "Choose your career stage.";
  if (section === "interests" && !profile.career_interests.length) errors["career_interests"] = "Select at least one career interest.";
  return errors;
}

// Accept only editable frontend fields; identity and email cannot be overridden.
export function parseProfileOverrides(raw: string | null): Partial<LearnerProfile> {
  if (!raw) return {};
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    const source = data as Record<string, unknown>;
    const output: Record<string, unknown> = {};
    for (const key of ["full_name", "phone", "skills_other", "experience_level", "career_stage", "about_me"]) {
      if (typeof source[key] === "string") output[key] = source[key];
    }
    for (const key of ["skills_to_improve", "learning_goals", "career_interests"]) {
      const value = source[key];
      if (Array.isArray(value) && value.every((item) => typeof item === "string")) output[key] = value;
    }
    for (const key of ["avatar_id", "avatar_theme"]) {
      if (typeof source[key] === "string" || source[key] === null) output[key] = source[key];
    }
    return output as Partial<LearnerProfile>;
  } catch { return {}; }
}

export const profileStorageKey = (userId: string) => `lws-profile:${userId}`;