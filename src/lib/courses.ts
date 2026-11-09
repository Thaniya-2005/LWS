import communication from "@/assets/courses/communication.jpg.asset.json";
import resume from "@/assets/courses/resume.jpg.asset.json";
import linkedin from "@/assets/courses/linkedin.jpg.asset.json";
import interview from "@/assets/courses/interview.jpg.asset.json";
import jobSearch from "@/assets/courses/job-search.jpg.asset.json";
import sideHustle from "@/assets/courses/side-hustle.jpg.asset.json";
import launchpad from "@/assets/courses/career-launchpad.png.asset.json";
import kickstart from "@/assets/courses/career-kickstart.jpg.asset.json";

export type Category =
  | "Career Development"
  | "Communication"
  | "Resume & LinkedIn"
  | "Job Preparation"
  | "Side Income";

export type Access = "free" | "paid" | "locked" | "coming-soon";

export type Course = {
  id: string;
  title: string;
  category: Category;
  description: string;
  level: "Beginner" | "Intermediate";
  duration: string;
  price: number; // INR, 0 = free
  access: Access;
  thumbnail: string;
  outcomes: string[];
  premium?: boolean;
};

export const categories: { name: Category; tone: string }[] = [
  { name: "Career Development", tone: "bg-cat-orange" },
  { name: "Communication", tone: "bg-cat-violet" },
  { name: "Resume & LinkedIn", tone: "bg-cat-blue" },
  { name: "Job Preparation", tone: "bg-cat-rose" },
  { name: "Side Income", tone: "bg-cat-green" },
];

export const courses: Course[] = [
  {
    id: "career-kickstart",
    title: "Career Kickstart — Find Your Direction & Get Job-Ready",
    category: "Career Development",
    description: "Build foundational job-ready skills and prepare to land career opportunities.",
    level: "Beginner",
    duration: "30 Days",
    price: 0,
    access: "free",
    thumbnail: kickstart.url,
    outcomes: ["Discover your direction", "Build key skills", "Create a strong resume", "Get job-ready"],
  },
  {
    id: "career-launchpad",
    title: "Career Launchpad — Plan, Build, Grow & Get Hired",
    category: "Career Development",
    description: "A complete career programme covering career clarity, resume building, interview preparation and job search strategy.",
    level: "Beginner",
    duration: "30 Days",
    price: 5999,
    access: "paid",
    premium: true,
    thumbnail: launchpad.url,
    outcomes: ["Career clarity", "Resume building", "Interview preparation", "Job search strategy"],
  },
  {
    id: "communication-skills",
    title: "Communication Skills for Career Growth",
    category: "Communication",
    description: "Speak confidently, express clearly, and build better professional connections.",
    level: "Beginner",
    duration: "Self-Paced",
    price: 1499,
    access: "coming-soon",
    thumbnail: communication.url,
    outcomes: ["Speak confidently", "Express clearly", "Build better connections"],
  },
  {
    id: "resume-building",
    title: "Resume Building Masterclass",
    category: "Resume & LinkedIn",
    description: "Create ATS-friendly, industry-ready resumes that stand out to recruiters.",
    level: "Beginner",
    duration: "Self-Paced",
    price: 2499,
    access: "coming-soon",
    thumbnail: resume.url,
    outcomes: ["ATS-friendly formatting", "Industry-ready structure", "Get more interviews"],
  },
  {
    id: "linkedin-branding",
    title: "LinkedIn & Personal Branding Masterclass",
    category: "Resume & LinkedIn",
    description: "Build a strong professional presence and attract better opportunities.",
    level: "Beginner",
    duration: "Self-Paced",
    price: 2499,
    access: "coming-soon",
    thumbnail: linkedin.url,
    outcomes: ["Be visible", "Build credibility", "Create opportunities"],
  },
  {
    id: "interview-preparation",
    title: "Interview Preparation Mastery",
    category: "Job Preparation",
    description: "Practice, strategize, and build confidence for real interview success.",
    level: "Intermediate",
    duration: "Self-Paced",
    price: 2999,
    access: "coming-soon",
    thumbnail: interview.url,
    outcomes: ["Answer confidently", "Handle tough questions", "Showcase your strengths"],
  },
  {
    id: "job-search-strategy",
    title: "Job Search & Placement Strategy Masterclass",
    category: "Job Preparation",
    description: "The right strategy to find real opportunities and take your next step.",
    level: "Beginner",
    duration: "Self-Paced",
    price: 1999,
    access: "coming-soon",
    thumbnail: jobSearch.url,
    outcomes: ["Find the right opportunities", "Leverage networking", "Ace interviews"],
  },
  {
    id: "side-hustle-starter",
    title: "Side Hustle Starter",
    category: "Side Income",
    description: "Turn your skills into income with step-by-step guidance.",
    level: "Beginner",
    duration: "Self-Paced",
    price: 1999,
    access: "coming-soon",
    thumbnail: sideHustle.url,
    outcomes: ["Explore side hustle ideas", "Learn practical skills", "Start earning"],
  },
];

export const formatPrice = (p: number) => (p === 0 ? "Free" : `₹${p.toLocaleString("en-IN")}`);
export const getCourse = (id: string) => courses.find((c) => c.id === id);
