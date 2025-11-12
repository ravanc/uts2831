// ============================================================================
// User Roles and Authentication
// ============================================================================

export type UserRole = 'employee' | 'employer';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
}

// ============================================================================
// Personality Assessment - Ensemble Model
// ============================================================================

// Big Five (OCEAN) Model
export interface BigFiveTraits {
  openness: number; // 0-100
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

// Myers-Briggs Type Indicator
export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface MBTITraits {
  type: MBTIType;
  introversion_extraversion: number; // 0-100 (0=I, 100=E)
  intuition_sensing: number; // 0-100 (0=S, 100=N)
  thinking_feeling: number; // 0-100 (0=F, 100=T)
  judging_perceiving: number; // 0-100 (0=P, 100=J)
}

// DISC Model
export interface DISCTraits {
  dominance: number; // 0-100
  influence: number;
  steadiness: number;
  conscientiousness: number;
}

// Ensemble Personality Profile
export interface PersonalityProfile {
  bigFive: BigFiveTraits;
  mbti: MBTITraits;
  disc: DISCTraits;
  lastAssessed: Date;
}

// ============================================================================
// Skills and Interests
// ============================================================================

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  verified: boolean;
}

export interface Interest {
  category: string;
  topics: string[];
  intensity: number; // 0-100
}

// ============================================================================
// Projects and Work Experience
// ============================================================================

export interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  technologies: string[];
  startDate: Date;
  endDate: Date | null;
  achievements: string[];
  imageUrl?: string;
  url?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  achievements: string[];
  skills: string[];
}

// ============================================================================
// Reviews and Recommendations
// ============================================================================

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerPosition: string;
  reviewerCompany: string;
  rating: number; // 1-5
  comment: string;
  skills: string[];
  date: Date;
  verified: boolean;
}

export interface Recommendation {
  id: string;
  recommenderId: string;
  recommenderName: string;
  recommenderPosition: string;
  recommenderCompany: string;
  relationship: string;
  text: string;
  date: Date;
  verified: boolean;
}

// ============================================================================
// Employee Profile
// ============================================================================

export interface EmployeeProfile {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    bio: string;
    avatarUrl: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
  };
  personality: PersonalityProfile;
  skills: Skill[];
  interests: Interest[];
  workExperience: WorkExperience[];
  projects: Project[];
  education: {
    degree: string;
    institution: string;
    field: string;
    graduationYear: number;
  }[];
  reviews: Review[];
  recommendations: Recommendation[];
  availability: {
    status: 'actively_looking' | 'open_to_opportunities' | 'not_looking';
    startDate?: Date;
  };
  preferences: {
    remoteWork: boolean;
    willingToRelocate: boolean;
    preferredRoles: string[];
    preferredIndustries: string[];
    minimumSalary?: number;
  };
}

// ============================================================================
// Company and Teams
// ============================================================================

export interface TeamMember {
  employeeId: string;
  role: string;
  joinedDate: Date;
}

export interface Team {
  id: string;
  name: string;
  department: string;
  managerId: string;
  members: TeamMember[];
  description: string;
  goals: string[];
}

export interface CompanyProject {
  id: string;
  title: string;
  description: string;
  impact: string[];
  technologies: string[];
  teamSize: number;
  status: 'active' | 'completed' | 'planned';
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  description: string;
  logoUrl: string;
  website: string;
  location: string;
  culture: string[];
  benefits: string[];
  teams: Team[];
  publicProjects?: CompanyProject[];
}

// ============================================================================
// Jobs
// ============================================================================

export interface Job {
  id: string;
  companyId: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  remotePolicy: 'remote' | 'hybrid' | 'onsite';
  description: string;
  responsibilities: string[];
  requirements: {
    required: string[];
    preferred: string[];
  };
  skills: {
    name: string;
    required: boolean;
  }[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  benefits: string[];
  postedDate: Date;
  idealPersonality: {
    bigFive: Partial<BigFiveTraits>;
    disc: Partial<DISCTraits>;
    mbtiTypes: MBTIType[];
  };
  teamId?: string;
}

// ============================================================================
// Matching and Analytics
// ============================================================================

export interface PersonalityMatch {
  score: number; // 0-100
  breakdown: {
    bigFive: number;
    mbti: number;
    disc: number;
  };
  strengths: string[];
  considerations: string[];
}

export interface MatchReason {
  point: string; // Main point/claim
  evidence: string; // Supporting evidence
}

export interface JobMatch {
  jobId: string;
  overallScore: number; // 0-100
  personalityMatch: PersonalityMatch;
  skillsMatch: number; // 0-100
  interestsMatch: number; // 0-100
  preferencesMatch: number; // 0-100
  reasoning: MatchReason[];
}

export interface TeamDynamics {
  teamId: string;
  personalityDistribution: {
    bigFive: {
      average: BigFiveTraits;
      variance: BigFiveTraits;
    };
    mbti: {
      types: Record<MBTIType, number>;
    };
    disc: {
      average: DISCTraits;
      variance: DISCTraits;
    };
  };
  collaboration: {
    score: number; // 0-100
    strengths: string[];
    potentialFrictions: {
      severity: 'low' | 'medium' | 'high';
      description: string;
      involvedMembers: string[];
    }[];
  };
  balance: {
    score: number; // 0-100
    recommendations: string[];
  };
  diversity: {
    score: number; // 0-100
    analysis: string;
  };
}

export interface CandidateMatch {
  candidateId: string;
  overallScore: number; // 0-100
  personalityFit: PersonalityMatch;
  skillsMatch: number;
  experienceMatch: number;
  culturalFit: number;
  teamFit?: {
    teamId: string;
    score: number;
    reasoning: string[];
  };
  strengths: string[];
  concerns: string[];
}

// ============================================================================
// Organization Insights
// ============================================================================

export interface OrganizationNode {
  id: string;
  type: 'company' | 'department' | 'team' | 'employee';
  name: string;
  title?: string;
  children?: OrganizationNode[];
  employeeId?: string;
  teamId?: string;
  metadata?: {
    size?: number;
    personality?: PersonalityProfile;
  };
}

export interface HiringRecommendation {
  teamId: string;
  reasoning: string;
  idealProfile: {
    personality: Partial<PersonalityProfile>;
    skills: string[];
    experience: string;
  };
  impact: {
    collaboration: number;
    diversity: number;
    balance: number;
  };
  topCandidates: CandidateMatch[];
}

// ============================================================================
// Job Applications
// ============================================================================

export type ApplicationStatus =
  | 'applied'
  | 'reviewing'
  | 'interviewing'
  | 'offer'
  | 'accepted'
  | 'rejected';

export interface ApplicationStatusHistoryEntry {
  status: ApplicationStatus;
  timestamp: Date;
  note?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  employeeId: string;
  status: ApplicationStatus;
  appliedDate: Date;
  lastUpdated: Date;
  coverLetter?: string;
  matchScore: number;
  statusHistory: ApplicationStatusHistoryEntry[];
}
