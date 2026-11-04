export type CounsellingSession = { mins: 30 | 45 | 60; price: number; desc: string; inc: string[]; popular?: boolean };

export const counsellingSessions: CounsellingSession[] = [
  { mins: 30, price: 1199, desc: "Quick clarity on one focused question.", inc: ["Career clarity", "Resume quick review", "Next-step guidance"] },
  { mins: 45, price: 1699, desc: "Deeper discussion and a personalised plan.", inc: ["Skill gap analysis", "Resume & LinkedIn review", "Personalised action plan"], popular: true },
  { mins: 60, price: 2199, desc: "Complete career strategy session.", inc: ["Long-term career roadmap", "Interview guidance", "Job search strategy"] },
];

export const INTRO_DONE_KEY = "lws-counselling-intro";
