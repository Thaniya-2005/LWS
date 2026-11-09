export type Lesson = { day: number; title: string; description: string; type: string; video: string; activity: string };
export type Quiz = { title: string; afterDay: number; questions: number; topics: string[] };
export type Module = { number: number; title: string; description: string; lessons: Lesson[]; resources: string[]; note?: string; quiz?: Quiz; finalAssessment?: boolean };

const L = (day: number, title: string, description: string, type: string, video: string, activity: string): Lesson => ({ day, title, description, type, video, activity });

export const launchpadDetails = {
  courseId: "career-launchpad",
  shortDescription: "A 30-day career transformation program to gain clarity, prepare for career opportunities, grow confidently at work, and create a practical 90-day career action plan.",
  about: [
    "Career Launchpad is a practical 30-day career development program designed to help professionals understand where they are, where they want to go, and what actions they need to take next.",
    "Instead of simply providing information, the course takes learners through a structured journey of self-discovery, career clarity, interview preparation, workplace growth, career transition planning, and execution.",
    "The course is designed around learning + reflection + action, so learners finish not just with knowledge, but with tangible career-development assets and a clear next-step plan.",
  ],
  outcomes: [
    "Understand their personality, strengths, skills, and work preferences",
    "Define their career vision and goals",
    "Create a personal Career Clarity Blueprint",
    "Understand the fundamentals of resume, LinkedIn, and personal branding",
    "Prepare effectively for interviews",
    "Build STAR-based interview stories",
    "Develop workplace communication skills",
    "Learn how to handle feedback and performance conversations",
    "Increase professional visibility",
    "Develop leadership presence",
    "Evaluate whether a career pivot may be right for them",
    "Identify transferable skills and career opportunities",
    "Understand different side-income possibilities",
    "Build a 30-day action plan",
    "Create a 90-day Career Growth Roadmap",
  ],
  categories: { primary: "Career Development", secondary: "Professional Skills / Personal Development" },
  level: "Beginner",
  duration: "30 Days",
  engagement: "10–12 hours",
  engagementIncludes: ["Video lessons", "Worksheets", "Reflection", "Activities", "Quizzes", "Career planning exercises"],
  quizRules: { types: "MCQ & True or False", passing: "55%", attempts: 2 },
  modules: [
    { number: 1, title: "Career Clarity & Direction", description: "Help learners understand themselves, identify their strengths, define their career vision, establish meaningful goals, and create a clear career direction.", lessons: [
      L(1, "Career Starting Point & Course Orientation", "Understand the program and identify your current career situation, challenges and desired outcomes.", "Video + Activity", "6–8 min", "Activity"),
      L(2, "Personality & Work Style", "Identify personality traits, preferred work environments and work preferences.", "Video + Activity", "7–9 min", "Personality Assessment"),
      L(3, "Strength & Skill Mapping", "Identify your strongest skills, natural abilities and areas where others value you.", "Video + Activity", "7–9 min", "Strength Mapping"),
      L(4, "Defining Your Career Vision", "Create a clear direction for your desired role, work and professional future.", "Video + Activity", "8–10 min", "Career Vision Worksheet"),
      L(5, "Ideal Workday Visualisation", "Visualise and document the type of work life you want to create.", "Video + Activity", "5–7 min", "Ideal Workday Exercise"),
      L(6, "SMART Career Goals", "Convert your career vision into short- and long-term goals.", "Video + Activity", "7–9 min", "SMART Goals Worksheet"),
      L(7, "Career Clarity Blueprint", "Consolidate your strengths, vision, goals and next step into one blueprint.", "Video + Activity", "8–10 min", "Career Clarity Blueprint"),
    ], resources: ["Career Clarity Workbook", "Personality & Work Style Assessment", "Strength Mapping Worksheet", "Career Vision Worksheet", "Ideal Workday Worksheet", "SMART Goals Worksheet", "Career Clarity Blueprint"],
      quiz: { title: "Quiz 1 — Career Clarity Check", afterDay: 7, questions: 8, topics: ["Personality/work style", "Strengths", "Career vision", "Ideal workday", "Goals"] } },
    { number: 2, title: "Career Positioning Fundamentals", description: "Introduce learners to the fundamentals of professional positioning through resume, LinkedIn, and personal branding. This module is intentionally introductory and directs learners toward the specialist courses for deeper implementation.", lessons: [
      L(8, "Resume Fundamentals", "Understand what makes a resume effective and identify common mistakes.", "Video + Activity", "7–9 min", "Resume Audit Activity"),
      L(9, "LinkedIn Fundamentals", "Understand the essential components of a professional LinkedIn profile.", "Video + Activity", "7–9 min", "LinkedIn Audit Activity"),
      L(10, "Personal Branding Fundamentals", "Understand personal branding and create an initial professional brand statement.", "Video + Activity", "7–9 min", "Personal Brand Statement Activity"),
    ], resources: ["Resume Audit Checklist", "LinkedIn Basic Audit Checklist", "Personal Brand Statement Worksheet"],
      note: "No full resume-building, LinkedIn strategy, or personal-branding implementation is included here. Those remain separate specialist courses.",
      quiz: { title: "Quiz 2 — Career Positioning Fundamentals", afterDay: 10, questions: 6, topics: ["Resume fundamentals", "LinkedIn fundamentals", "Personal branding", "Professional positioning"] } },
    { number: 3, title: "Interview Readiness", description: "Prepare learners to approach interviews with greater confidence, structure their answers effectively, communicate their achievements, manage interview nerves, and negotiate professionally.", lessons: [
      L(11, "Interview Preparation", "Understand what to prepare before an interview and how to research the role.", "Video + Activity", "8–10 min", "Interview Preparation Checklist"),
      L(12, "The STAR Method", "Learn how to structure behavioural interview answers using STAR.", "Video + Activity", "8–10 min", "STAR Practice"),
      L(13, "Building Your STAR Story Bank", "Develop 3–5 stories based on your real experiences.", "Activity + Video", "8–10 min", "STAR Story Bank"),
      L(14, "Common Interview Questions", "Prepare structured responses to frequently asked interview questions.", "Video + Activity", "9–11 min", "Common Questions"),
      L(15, "Tough & Behavioural Questions", "Learn how to handle challenging and behavioural questions.", "Video + Activity", "9–11 min", "Tough Questions"),
      L(16, "Interview Confidence & Body Language", "Manage nerves and communicate confidence through verbal and non-verbal behaviour.", "Video + Activity", "7–9 min", "Confidence & Body Language"),
      L(17, "Interview Practice & Self-Review", "Practise answers, record yourself and evaluate your performance.", "Activity", "5–7 min", "Recorded Interview Practice"),
    ], resources: ["Interview Preparation Checklist", "STAR Story Template", "Interview Answer Bank", "Self-Review Scorecard", "Interview Practice Worksheet"],
      quiz: { title: "Quiz 3 — Interview Readiness", afterDay: 17, questions: 10, topics: ["Interview preparation", "STAR", "Behavioural questions", "Common interview questions", "Body language", "Interview confidence"] } },
    { number: 4, title: "Workplace Growth & Leadership", description: "Help learners grow after getting the opportunity by developing workplace communication, feedback management, visibility, relationship-building, and leadership presence.", lessons: [
      L(18, "Communicating with Impact", "Use the PAC framework to communicate clearly and professionally.", "Video + Activity", "8–10 min", "PAC Communication Exercise"),
      L(19, "Difficult Workplace Conversations", "Prepare for challenging conversations with managers, peers and stakeholders.", "Video + Scenarios", "8–10 min", "Difficult Conversation Scenario"),
      L(20, "Feedback & Performance Reviews", "Learn how to receive feedback and communicate achievements during reviews.", "Video + Activity", "8–10 min", "Feedback Exercise"),
      L(21, "Strategic Visibility & Workplace Networking", "Increase professional visibility through relationships, updates and meaningful workplace interactions.", "Video + Activity", "8–10 min", "Visibility Exercise"),
      L(22, "Building Leadership Presence", "Develop ownership, solution-oriented thinking and leadership behaviour.", "Video + Activity", "8–10 min", "Leadership Reflection"),
      L(23, "My Workplace Growth Plan", "Create practical actions for improving communication, visibility and leadership.", "Activity + Video", "6–8 min", "Workplace Growth Plan"),
    ], resources: ["PAC Communication Worksheet", "Difficult Conversation Planner", "Feedback Reflection Sheet", "Performance Review Preparation Sheet", "Workplace Visibility Tracker", "Leadership Development Tracker", "90-Day Workplace Growth Plan"],
      quiz: { title: "Quiz 4 — Workplace Growth & Leadership", afterDay: 23, questions: 8, topics: ["PAC", "Feedback", "Performance reviews", "Visibility", "Networking", "Leadership presence"] } },
    { number: 5, title: "Career Pivot & Future Options", description: "Help learners evaluate potential career changes, understand transferable skills, and explore alternative career and income possibilities without encouraging impulsive decisions.", lessons: [
      L(24, "Career Pivot Clarity", "Evaluate what you want to move away from and what you want to move toward.", "Video + Activity", "8–10 min", "Career Pivot Assessment"),
      L(25, "Transferable & Monetisable Skills", "Identify skills that can support a new career direction or alternative opportunities.", "Video + Activity", "8–10 min", "Transferable Skills Map"),
      L(26, "Exploring Alternative Career Paths", "Understand possible career alternatives, freelancing, consulting and side-income options at an introductory level.", "Video + Activity", "7–9 min", "Alternative Career Exploration"),
    ], resources: ["Career Pivot Assessment", "Transferable Skills Map", "Career Options Worksheet", "Opportunity Exploration Worksheet"],
      quiz: { title: "Quiz 5 — Career Pivot & Future Options", afterDay: 26, questions: 6, topics: ["Career pivot", "Transferable skills", "Monetisable skills", "Alternative career path"] } },
    { number: 6, title: "Career Execution & 90-Day Growth Plan", description: "Bring the entire learning journey together and convert clarity into consistent career action through a 30-day execution plan, accountability system, and 90-day roadmap.", lessons: [
      L(27, "Career Strategy & Priorities", "Bring your career goals, strengths, skills and opportunities together into a practical strategy.", "Video + Activity", "8–10 min", "Career Strategy Exercise"),
      L(28, "Building Your 30-Day Career Action Plan", "Create specific actions across career growth, visibility, learning and opportunities.", "Video + Activity", "8–10 min", "30-Day Action Plan"),
      L(29, "Accountability & Consistency", "Build a system for tracking progress and maintaining momentum.", "Video + Activity", "6–8 min", "Accountability System"),
      L(30, "Your 90-Day Career Growth Roadmap", "Consolidate your learning and create your next 90 days of career action.", "Video + Activity", "10–12 min", "90-Day Career Roadmap"),
    ], resources: ["Career Strategy Worksheet", "30-Day Career Action Planner", "Weekly Career Tracker", "Accountability Tracker", "90-Day Career Growth Roadmap"], finalAssessment: true },
  ] as Module[],
};

export const getCourseDetails = (id: string) => (id === launchpadDetails.courseId ? launchpadDetails : undefined);
