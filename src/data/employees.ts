import { EmployeeProfile } from "@/types";
import {
  generatePersonalityProfile,
  randomDate,
  generateId,
} from "./generators";

export const mockEmployees: EmployeeProfile[] = [
  {
    id: "emp-001",
    personalInfo: {
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      title: "Senior Full-Stack Engineer",
      bio: "Passionate full-stack developer with 7 years of experience building scalable web applications. Love mentoring junior developers and exploring new technologies.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      linkedinUrl: "https://linkedin.com/in/sarahchen",
      portfolioUrl: "https://sarahchen.dev",
    },
    personality: generatePersonalityProfile("INTJ", {
      openness: 85,
      conscientiousness: 80,
    }),
    skills: [
      { name: "React", level: "expert", yearsOfExperience: 5, verified: true },
      {
        name: "TypeScript",
        level: "expert",
        yearsOfExperience: 4,
        verified: true,
      },
      {
        name: "Node.js",
        level: "advanced",
        yearsOfExperience: 6,
        verified: true,
      },
      {
        name: "Python",
        level: "advanced",
        yearsOfExperience: 3,
        verified: true,
      },
      {
        name: "GraphQL",
        level: "advanced",
        yearsOfExperience: 3,
        verified: true,
      },
      {
        name: "AWS",
        level: "intermediate",
        yearsOfExperience: 2,
        verified: false,
      },
    ],
    interests: [
      {
        category: "Technology",
        topics: ["AI/ML", "Web Performance", "Developer Tools"],
        intensity: 90,
      },
      {
        category: "Leadership",
        topics: ["Mentoring", "Tech Talks", "Code Review"],
        intensity: 75,
      },
      {
        category: "Personal",
        topics: ["Rock Climbing", "Photography", "Sci-Fi Books"],
        intensity: 60,
      },
    ],
    workExperience: [
      {
        id: generateId(),
        company: "TechCorp Inc.",
        position: "Senior Full-Stack Engineer",
        startDate: new Date("2021-03-01"),
        endDate: null,
        description:
          "Leading development of core platform features and mentoring team members.",
        achievements: [
          "Reduced API response times by 40% through optimization",
          "Mentored 5 junior developers to mid-level positions",
          "Led migration to TypeScript across 15 microservices",
        ],
        skills: ["React", "Node.js", "TypeScript", "GraphQL", "PostgreSQL"],
      },
      {
        id: generateId(),
        company: "StartupXYZ",
        position: "Full-Stack Developer",
        startDate: new Date("2018-06-01"),
        endDate: new Date("2021-02-28"),
        description:
          "Built and scaled the core product from MVP to serving 100K+ users.",
        achievements: [
          "Architected and built the initial platform MVP",
          "Implemented CI/CD pipeline reducing deployment time by 70%",
          "Grew engineering team from 3 to 12 members",
        ],
        skills: ["React", "Node.js", "MongoDB", "Docker", "AWS"],
      },
    ],
    projects: [
      {
        id: generateId(),
        title: "Real-time Analytics Dashboard",
        description:
          "Built a real-time analytics dashboard processing 1M+ events/day with sub-second latency.",
        role: "Tech Lead",
        technologies: ["React", "WebSocket", "Redis", "TimescaleDB", "D3.js"],
        startDate: new Date("2022-01-15"),
        endDate: new Date("2022-08-30"),
        achievements: [
          "Achieved 99.9% uptime",
          "Reduced data processing latency by 60%",
          "Implemented real-time collaboration features",
        ],
        imageUrl: "/projects/analytics-dashboard.jpg",
      },
      {
        id: generateId(),
        title: "Developer Tooling Platform",
        description:
          "Created internal tooling platform used by 200+ engineers daily.",
        role: "Lead Developer",
        technologies: ["Next.js", "GraphQL", "PostgreSQL", "Docker"],
        startDate: new Date("2021-09-01"),
        endDate: new Date("2022-03-15"),
        achievements: [
          "Improved developer productivity by 30%",
          "Integrated with 8 third-party services",
          "Achieved 95% user satisfaction score",
        ],
      },
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        institution: "Stanford University",
        field: "Computer Science",
        graduationYear: 2017,
      },
    ],
    reviews: [
      {
        id: generateId(),
        reviewerId: "mgr-001",
        reviewerName: "Michael Torres",
        reviewerPosition: "Engineering Manager",
        reviewerCompany: "TechCorp Inc.",
        rating: 5,
        comment:
          "Sarah consistently delivers high-quality work and is an exceptional mentor. Her technical skills are top-notch, and she elevates the entire team.",
        skills: ["Leadership", "React", "System Design", "Mentoring"],
        date: new Date("2023-12-15"),
        verified: true,
      },
      {
        id: generateId(),
        reviewerId: "peer-001",
        reviewerName: "Jessica Liu",
        reviewerPosition: "Senior Engineer",
        reviewerCompany: "TechCorp Inc.",
        rating: 5,
        comment:
          "Working with Sarah has been incredible. She's always willing to help and her code reviews are thorough and educational.",
        skills: ["Collaboration", "Code Review", "TypeScript"],
        date: new Date("2023-11-20"),
        verified: true,
      },
    ],
    recommendations: [
      {
        id: generateId(),
        recommenderId: "cto-001",
        recommenderName: "David Park",
        recommenderPosition: "CTO",
        recommenderCompany: "StartupXYZ",
        relationship: "Former Manager",
        text: "Sarah was instrumental in building our platform from the ground up. Her technical expertise and leadership qualities make her a valuable asset to any team.",
        date: new Date("2021-03-01"),
        verified: true,
      },
    ],
    availability: {
      status: "open_to_opportunities",
    },
    preferences: {
      remoteWork: true,
      willingToRelocate: false,
      preferredRoles: ["Senior Engineer", "Tech Lead", "Engineering Manager"],
      preferredIndustries: ["Technology", "SaaS", "AI/ML"],
      minimumSalary: 180000,
    },
  },
  {
    id: "emp-002",
    personalInfo: {
      name: "Marcus Johnson",
      email: "marcus.j@example.com",
      phone: "+1 (555) 234-5678",
      location: "Austin, TX",
      title: "UX/UI Designer",
      bio: "Creative designer passionate about crafting delightful user experiences. 5+ years transforming complex problems into intuitive interfaces.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      portfolioUrl: "https://marcusdesigns.com",
    },
    personality: generatePersonalityProfile("ENFP", {
      openness: 90,
      agreeableness: 80,
    }),
    skills: [
      { name: "Figma", level: "expert", yearsOfExperience: 5, verified: true },
      {
        name: "User Research",
        level: "advanced",
        yearsOfExperience: 5,
        verified: true,
      },
      {
        name: "Prototyping",
        level: "expert",
        yearsOfExperience: 5,
        verified: true,
      },
      {
        name: "Design Systems",
        level: "advanced",
        yearsOfExperience: 3,
        verified: true,
      },
      {
        name: "HTML/CSS",
        level: "intermediate",
        yearsOfExperience: 4,
        verified: false,
      },
    ],
    interests: [
      {
        category: "Design",
        topics: ["UI/UX", "Design Systems", "Accessibility"],
        intensity: 95,
      },
      {
        category: "Technology",
        topics: ["Frontend Development", "Design Tools"],
        intensity: 70,
      },
      {
        category: "Personal",
        topics: ["Digital Art", "Gaming", "Music Production"],
        intensity: 80,
      },
    ],
    workExperience: [
      {
        id: generateId(),
        company: "DesignHub",
        position: "Senior UX/UI Designer",
        startDate: new Date("2020-09-01"),
        endDate: null,
        description:
          "Leading design for multiple product lines and establishing design system standards.",
        achievements: [
          "Led redesign that increased user engagement by 45%",
          "Established company-wide design system adopted by 30+ designers",
          "Conducted 50+ user research sessions",
        ],
        skills: ["Figma", "User Research", "Design Systems", "Prototyping"],
      },
    ],
    projects: [
      {
        id: generateId(),
        title: "E-commerce Mobile App Redesign",
        description:
          "Complete redesign of mobile shopping experience for 2M+ active users.",
        role: "Lead Designer",
        technologies: ["Figma", "Principle", "Maze"],
        startDate: new Date("2022-06-01"),
        endDate: new Date("2023-01-15"),
        achievements: [
          "35% increase in conversion rate",
          "50% reduction in cart abandonment",
          "Awarded Best Mobile Shopping Experience 2023",
        ],
        imageUrl: "/projects/ecommerce-redesign.jpg",
      },
    ],
    education: [
      {
        degree: "B.F.A. Graphic Design",
        institution: "Rhode Island School of Design",
        field: "Graphic Design",
        graduationYear: 2018,
      },
    ],
    reviews: [
      {
        id: generateId(),
        reviewerId: "pm-001",
        reviewerName: "Emily Watson",
        reviewerPosition: "Product Manager",
        reviewerCompany: "DesignHub",
        rating: 5,
        comment:
          "Marcus brings creativity and user-centricity to every project. His designs are not just beautiful but solve real user problems.",
        skills: ["UX Design", "User Research", "Collaboration"],
        date: new Date("2023-10-10"),
        verified: true,
      },
    ],
    recommendations: [],
    availability: {
      status: "actively_looking",
      startDate: new Date("2024-02-01"),
    },
    preferences: {
      remoteWork: true,
      willingToRelocate: true,
      preferredRoles: ["Senior UX Designer", "Lead Designer", "Design Manager"],
      preferredIndustries: ["Technology", "E-commerce", "SaaS"],
      minimumSalary: 140000,
    },
  },
  {
    id: "emp-003",
    personalInfo: {
      name: "Dr. Aisha Patel",
      email: "aisha.patel@example.com",
      phone: "+1 (555) 345-6789",
      location: "Boston, MA",
      title: "Machine Learning Engineer",
      bio: "PhD in Computer Science specializing in ML/AI. 6 years building production ML systems at scale. Passionate about responsible AI.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha",
      linkedinUrl: "https://linkedin.com/in/aishapatel",
    },
    personality: generatePersonalityProfile("INTP", {
      openness: 88,
      conscientiousness: 85,
    }),
    skills: [
      { name: "Python", level: "expert", yearsOfExperience: 8, verified: true },
      {
        name: "TensorFlow",
        level: "expert",
        yearsOfExperience: 5,
        verified: true,
      },
      {
        name: "PyTorch",
        level: "advanced",
        yearsOfExperience: 4,
        verified: true,
      },
      {
        name: "MLOps",
        level: "advanced",
        yearsOfExperience: 3,
        verified: true,
      },
      {
        name: "Deep Learning",
        level: "expert",
        yearsOfExperience: 6,
        verified: true,
      },
      { name: "NLP", level: "advanced", yearsOfExperience: 4, verified: true },
    ],
    interests: [
      {
        category: "AI/ML",
        topics: ["Deep Learning", "NLP", "Computer Vision", "Responsible AI"],
        intensity: 95,
      },
      {
        category: "Research",
        topics: ["Academic Papers", "Conferences", "Publications"],
        intensity: 85,
      },
      {
        category: "Personal",
        topics: ["Chess", "Hiking", "Classical Music"],
        intensity: 55,
      },
    ],
    workExperience: [
      {
        id: generateId(),
        company: "AI Innovations Lab",
        position: "Senior ML Engineer",
        startDate: new Date("2021-01-15"),
        endDate: null,
        description:
          "Building and deploying large-scale ML models for production systems.",
        achievements: [
          "Improved model accuracy by 23% through novel architecture",
          "Reduced inference latency from 500ms to 50ms",
          "Published 3 papers in top-tier conferences",
        ],
        skills: ["Python", "TensorFlow", "Kubernetes", "MLOps"],
      },
    ],
    projects: [
      {
        id: generateId(),
        title: "Multi-lingual NLP System",
        description:
          "Built NLP system supporting 15 languages with state-of-the-art accuracy.",
        role: "ML Lead",
        technologies: ["PyTorch", "Transformers", "BERT", "FastAPI"],
        startDate: new Date("2022-03-01"),
        endDate: new Date("2023-06-30"),
        achievements: [
          "Achieved 94% accuracy across all languages",
          "Processing 10M+ requests daily",
          "Featured in AI Research Weekly",
        ],
      },
    ],
    education: [
      {
        degree: "PhD Computer Science",
        institution: "MIT",
        field: "Machine Learning",
        graduationYear: 2019,
      },
      {
        degree: "M.S. Computer Science",
        institution: "MIT",
        field: "Artificial Intelligence",
        graduationYear: 2016,
      },
    ],
    reviews: [
      {
        id: generateId(),
        reviewerId: "dir-001",
        reviewerName: "Prof. Robert Chang",
        reviewerPosition: "Research Director",
        reviewerCompany: "AI Innovations Lab",
        rating: 5,
        comment:
          "Aisha is one of the most talented ML engineers I've worked with. Her combination of theoretical knowledge and practical implementation skills is rare.",
        skills: ["Machine Learning", "Research", "Problem Solving"],
        date: new Date("2023-12-01"),
        verified: true,
      },
    ],
    recommendations: [
      {
        id: generateId(),
        recommenderId: "prof-001",
        recommenderName: "Prof. Maria Garcia",
        recommenderPosition: "Professor",
        recommenderCompany: "MIT",
        relationship: "PhD Advisor",
        text: "Aisha's research contributions during her PhD were exceptional. She has a rare ability to bridge theoretical concepts with practical applications.",
        date: new Date("2019-05-15"),
        verified: true,
      },
    ],
    availability: {
      status: "open_to_opportunities",
    },
    preferences: {
      remoteWork: true,
      willingToRelocate: true,
      preferredRoles: ["ML Engineer", "Research Scientist", "ML Architect"],
      preferredIndustries: ["AI/ML", "Research", "Technology"],
      minimumSalary: 200000,
    },
  },
];

// Generate additional employees programmatically
const additionalEmployees = generateAdditionalEmployees(50);

export const allEmployees = [...mockEmployees, ...additionalEmployees];

function generateAdditionalEmployees(count: number): EmployeeProfile[] {
  const names = [
    "James Wilson",
    "Emma Davis",
    "Alex Kim",
    "Sofia Rodriguez",
    "Liam O'Connor",
    "Olivia Martinez",
    "Noah Brown",
    "Ava Taylor",
    "Ethan Anderson",
    "Mia Thomas",
    "Lucas Jackson",
    "Isabella White",
    "Mason Harris",
    "Charlotte Martin",
    "Logan Thompson",
    "Amelia Garcia",
    "Jackson Lee",
    "Harper Walker",
    "Aiden Hall",
    "Evelyn Allen",
    "Sebastian Young",
    "Abigail King",
    "Mateo Wright",
    "Emily Lopez",
    "Jack Hill",
    "Ella Scott",
    "Leo Green",
    "Scarlett Adams",
    "Henry Baker",
    "Grace Nelson",
    "Owen Carter",
    "Chloe Mitchell",
    "Benjamin Perez",
    "Luna Roberts",
    "Elijah Turner",
    "Aria Phillips",
    "William Campbell",
    "Layla Parker",
    "James Evans",
    "Nora Edwards",
    "Oliver Collins",
    "Hazel Stewart",
    "Theodore Morris",
    "Penelope Rogers",
    "Samuel Reed",
    "Zoe Cook",
    "David Morgan",
    "Stella Bell",
    "Joseph Murphy",
    "Aurora Bailey",
  ];

  const titles = [
    "Software Engineer",
    "Senior Software Engineer",
    "Product Manager",
    "Data Scientist",
    "DevOps Engineer",
    "Frontend Developer",
    "Backend Developer",
    "QA Engineer",
    "Security Engineer",
    "Cloud Architect",
    "Mobile Developer",
    "Product Designer",
    "Technical Writer",
    "Scrum Master",
    "Business Analyst",
    "Data Engineer",
    "Site Reliability Engineer",
    "Solutions Architect",
    "Engineering Manager",
    "Tech Lead",
  ];

  const companies = [
    "TechCorp Inc.",
    "InnovateTech",
    "CloudSystems",
    "DataFlow",
    "WebScale",
    "CodeCraft",
    "DigitalWorks",
    "SmartSolutions",
    "FutureTech",
    "DevHub",
  ];

  const techSkills = [
    "JavaScript",
    "Python",
    "Java",
    "TypeScript",
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "Django",
    "Spring Boot",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "GraphQL",
    "REST API",
    "Microservices",
  ];

  const employees: EmployeeProfile[] = [];

  for (let i = 0; i < count && i < names.length; i++) {
    const name = names[i];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const id = `emp-${String(i + 4).padStart(3, "0")}`;
    const seed = name.replace(/\s/g, "");

    const randomSkills = techSkills
      .sort(() => Math.random() - 0.5)
      .slice(0, 4 + Math.floor(Math.random() * 4))
      .map((skillName) => ({
        name: skillName,
        level: (["beginner", "intermediate", "advanced", "expert"] as const)[
          Math.floor(Math.random() * 4)
        ],
        yearsOfExperience: 1 + Math.floor(Math.random() * 8),
        verified: Math.random() > 0.3,
      }));

    employees.push({
      id,
      personalInfo: {
        name,
        email: `${name.toLowerCase().replace(/\s/g, ".")}@example.com`,
        phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${
          Math.floor(Math.random() * 9000) + 1000
        }`,
        location: [
          "San Francisco, CA",
          "New York, NY",
          "Austin, TX",
          "Seattle, WA",
          "Boston, MA",
        ][Math.floor(Math.random() * 5)],
        title,
        bio: `Experienced ${title.toLowerCase()} with passion for building great products.`,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
      },
      personality: generatePersonalityProfile(),
      skills: randomSkills,
      interests: [
        {
          category: "Technology",
          topics: techSkills.sort(() => Math.random() - 0.5).slice(0, 3),
          intensity: 60 + Math.floor(Math.random() * 35),
        },
      ],
      workExperience: [
        {
          id: generateId(),
          company,
          position: title,
          startDate: randomDate(new Date("2020-01-01"), new Date("2023-01-01")),
          endDate:
            Math.random() > 0.3
              ? null
              : randomDate(new Date("2023-01-01"), new Date()),
          description: `Working as ${title.toLowerCase()} at ${company}.`,
          achievements: [
            "Delivered key features on time",
            "Collaborated with cross-functional teams",
            "Improved system performance",
          ],
          skills: randomSkills.slice(0, 3).map((s) => s.name),
        },
      ],
      projects: [],
      education: [
        {
          degree: "B.S. Computer Science",
          institution: ["MIT", "Stanford", "Berkeley", "CMU", "Harvard"][
            Math.floor(Math.random() * 5)
          ],
          field: "Computer Science",
          graduationYear: 2015 + Math.floor(Math.random() * 8),
        },
      ],
      reviews: [],
      recommendations: [],
      availability: {
        status: (
          ["actively_looking", "open_to_opportunities", "not_looking"] as const
        )[Math.floor(Math.random() * 3)],
      },
      preferences: {
        remoteWork: Math.random() > 0.3,
        willingToRelocate: Math.random() > 0.5,
        preferredRoles: [title],
        preferredIndustries: ["Technology", "SaaS"],
        minimumSalary: 80000 + Math.floor(Math.random() * 120000),
      },
    });
  }

  return employees;
}
