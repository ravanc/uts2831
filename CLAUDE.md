# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CrewFit** is a comprehensive talent management and job matching platform mockup that connects employers and employees based on personality traits, skills, and team dynamics. It's built as a frontend-only demonstration using Next.js 14 with TypeScript.

### Core Concept
Unlike traditional job platforms, CrewFit uses an **ensemble personality assessment** combining:
- **Big Five (OCEAN)** - Scientifically validated personality traits
- **MBTI** - 16 personality type framework
- **DISC** - Work style and communication preferences

This multi-framework approach provides comprehensive compatibility scoring for job matching and team composition analysis.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for visualizations
- **Icons**: Lucide React

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

## Project Architecture

### Role-Based Access Control (RBAC)

The application has three distinct user roles with different views:

1. **Employee** - Access to:
   - Personal profile with personality insights
   - Job board with personality-based matching
   - Skills and project showcase

2. **Employer** - Access to:
   - Candidate search and matching
   - Job listings management
   - Team insights

3. **Executive** - Full access including:
   - Organization structure visualization
   - Team analytics dashboard
   - Hiring recommendations based on team composition

The role can be switched via the navbar dropdown menu for demo purposes. Role state is managed through `AuthContext` (`src/lib/auth-context.tsx`).

### Directory Structure

```
src/
├── app/                    # Next.js 14 App Router pages
│   ├── page.tsx           # Landing page
│   ├── profile/           # Employee profile page
│   ├── jobs/              # Job board with matching
│   ├── organization/      # Org structure view (Executive)
│   └── analytics/         # Team analytics dashboard (Executive)
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components (Navbar, MainLayout)
│   └── features/          # Feature-specific components
├── lib/                   # Utility functions and contexts
│   ├── auth-context.tsx   # RBAC context provider
│   ├── personality.ts     # Personality matching algorithms
│   └── utils.ts           # General utilities
├── types/
│   └── index.ts           # TypeScript type definitions
└── data/                  # Mock data
    ├── employees.ts       # 50+ employee profiles
    ├── companies.ts       # Company and team data
    ├── jobs.ts            # Job listings
    └── generators.ts      # Data generation utilities
```

### Key Type Definitions

All types are defined in `src/types/index.ts`:

- **PersonalityProfile**: Ensemble model with BigFive, MBTI, and DISC traits
- **EmployeeProfile**: Complete employee data including personality, skills, projects, reviews
- **Job**: Job listing with ideal personality profile
- **Company & Team**: Organization structure with team composition
- **JobMatch & PersonalityMatch**: Matching scores and reasoning

## Key Features & Implementation

### 1. Personality Matching Algorithm

Located in `src/lib/personality.ts`, the matching system:

- **calculateBigFiveMatch()**: Uses inverse Euclidean distance to measure similarity
- **calculateMBTIMatch()**: Scores based on shared preferences with bonus for complementary types
- **calculateDISCMatch()**: Compares work style profiles
- **calculatePersonalityMatch()**: Weighted ensemble combining all three frameworks (40% Big Five, 30% MBTI, 30% DISC)

Returns a `PersonalityMatch` object with:
- Overall score (0-100)
- Breakdown by framework
- Strengths and considerations

### 2. Employee Profile Page (`/profile`)

Comprehensive profile showcasing:
- Personal information and contact
- Personality visualization using radar charts (Big Five)
- MBTI type with description and strengths
- DISC work style with progress bars
- Skills with verification badges
- Work experience timeline
- Project portfolio
- Reviews and recommendations

Uses tabs for organization and includes personality insights generated from trait scores.

### 3. Job Board (`/jobs`)

Features:
- Real-time personality-based matching for all jobs
- Multi-dimensional match breakdown (personality, skills, interests, preferences)
- Search and filter capabilities
- Match reasoning and insights
- Visual indicators for skill matches
- Sort by match score or recency

Each job card displays:
- Overall match percentage with color coding
- Detailed breakdown across all dimensions
- Required skills highlighting (green badge if candidate has it)
- Match reasoning bullets

### 4. Organization Structure (`/organization`)

Executive view showing:
- Company overview with team statistics
- Expandable team list with personality diversity metrics
- Team member composition with MBTI types
- Personality distribution visualization
- Team insights (diversity, communication opportunities, potential friction)
- Detailed team member profiles

### 5. Team Analytics Dashboard (`/analytics`)

Comprehensive analytics including:
- Team selector to analyze different teams
- Key metrics (size, diversity, balance)
- MBTI type distribution (pie chart)
- Average Big Five profile (bar chart)
- DISC work style breakdown
- Generated insights (strengths, opportunities, warnings)
- Hiring recommendations based on personality gaps

Insights are dynamically generated based on:
- Personality diversity (unique MBTI types)
- Balance across dimensions
- Team composition patterns

## Mock Data

All data is client-side and stored in `src/data/`:

- **50+ employees** with complete profiles including personality assessments
- **3 companies** with multiple teams
- **10 job listings** with ideal personality profiles
- Data generators create realistic profiles with consistent personality traits

### Personality Data Generation

`generatePersonalityProfile()` creates realistic profiles:
- MBTI type influences Big Five scores (e.g., Extraverts have higher extraversion)
- All three frameworks are aligned for consistency
- Timestamps for assessment dates

## Navigation & Routing

- `/` - Landing page with features and role switcher
- `/profile` - Employee profile (all roles can view)
- `/jobs` - Job board with matching (all roles)
- `/organization` - Organization structure (Executive only in production; accessible to all in demo)
- `/analytics` - Team analytics (Executive only in production; accessible to all in demo)

The `MainLayout` component wraps all pages and includes the `Navbar` with role-based menu items.

## Styling Conventions

- Uses Tailwind utility classes throughout
- shadcn/ui provides consistent component styling
- Color coding for roles:
  - Blue: Employee
  - Green: Employer
  - Purple: Executive
- Gradient backgrounds for hero sections
- Cards with hover effects for interactivity

## Component Patterns

### Reusable Components

- **PersonalityRadar**: Recharts radar chart for Big Five visualization
- **MainLayout**: Wrapper providing navbar and consistent page structure
- **Navbar**: Role-based navigation with dropdown switcher

### Data Flow

1. Mock data imported from `src/data/`
2. Personality calculations performed client-side using `src/lib/personality.ts`
3. Components use `useMemo` for expensive calculations
4. State managed with React hooks and Context API (for auth/role)

## Important Notes

- **No Backend**: All data is mock and client-side
- **No Persistence**: Role switches and data are not persisted
- **No Authentication**: Login/logout are UI-only demonstrations
- **Accessibility**: Uses semantic HTML and shadcn/ui accessible components
- **Responsive**: All pages work on mobile, tablet, and desktop

## Future Enhancement Ideas

If expanding beyond mockup:
- Add actual authentication and user accounts
- Implement database for persistence
- Create API for personality matching
- Add real-time chat for employers/employees
- Integrate actual personality assessment tests
- Build recommendation engine for team composition
- Add data visualization for long-term team trends
