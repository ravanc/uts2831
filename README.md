# CrewFit - AI-Powered Talent Matching Platform

A comprehensive talent management and job matching platform mockup that goes beyond traditional resumes by incorporating personality traits, team dynamics, and organizational culture.

## Overview

CrewFit demonstrates an advanced talent matching system using an **ensemble personality assessment** approach combining:

- **Big Five (OCEAN)** - Scientifically validated personality framework
- **Myers-Briggs (MBTI)** - 16 personality type indicator
- **DISC** - Work style and communication preferences

This Next.js 14 application showcases how personality-based matching can create better employee-employer connections.

## Features

### For Employees
- 📊 **Comprehensive Profile** - Showcase skills, projects, personality traits, and reviews
- 🎯 **Personality-Based Job Matching** - Find jobs that match your personality and skills
- 📈 **Match Scoring** - Detailed compatibility breakdowns for each job (personality, skills, interests, preferences)

### For Employers
- 🔍 **Candidate Search** - Find candidates based on personality and skills
- 💼 **Job Listings** - Post jobs with ideal personality profiles
- 🤝 **Team Fit Analysis** - See how candidates fit with existing teams

### For Executives
- 🏢 **Organization View** - Visualize company structure with personality insights at every level
- 📊 **Team Analytics** - Comprehensive team dynamics and composition analysis
- 💡 **Hiring Recommendations** - Data-driven suggestions for optimal team balance

## Tech Stack

- **Next.js 14** (App Router) with TypeScript
- **Tailwind CSS** + **shadcn/ui** for beautiful, accessible UI components
- **Recharts** for data visualizations
- **Lucide React** for icons

## Getting Started

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Application Structure

### Pages

- **/** - Landing page with features overview and role switcher
- **/profile** - Employee profile with personality radar charts and insights
- **/jobs** - Job board with real-time personality-based matching
- **/organization** - Organization structure with team composition (Executive view)
- **/analytics** - Team analytics dashboard with hiring recommendations (Executive view)

### Role-Based Access Control (RBAC)

Switch between three roles using the navbar dropdown (demo purposes):

- **Employee** - View profile, search for jobs with personality matching
- **Employer** - Search candidates, view job listings with match scores
- **Executive** - Full access including org structure and team analytics

## Mock Data

Includes comprehensive mock data:
- **50+ employee profiles** with complete personality assessments (Big Five, MBTI, DISC)
- **3 companies** with multiple teams and organizational structures
- **10 job listings** with ideal personality profiles for matching
- **Reviews, recommendations**, and project portfolios

All data is client-side. No backend required.

## Key Features

### Personality Matching Algorithm

Multi-framework ensemble approach:

1. **Big Five Match** (40% weight) - Euclidean distance between trait scores
2. **MBTI Match** (30% weight) - Type compatibility with bonuses for complementary pairs
3. **DISC Match** (30% weight) - Work style alignment

Returns detailed match scores with strengths and considerations.

### Team Analytics

Automatically calculates:
- Personality diversity metrics (unique MBTI types)
- Team balance scores across Big Five and DISC dimensions
- Collaboration opportunities and potential friction points
- Hiring recommendations based on personality gaps

### Visual Components

- Radar charts for Big Five personality visualization
- Pie charts for MBTI type distribution
- Bar charts for team personality profiles
- Progress bars for DISC work style indicators
- Interactive org charts with expandable teams

## Project Structure

```
src/
├── app/                 # Next.js 14 App Router pages
│   ├── page.tsx        # Landing page
│   ├── profile/        # Employee profile
│   ├── jobs/           # Job board with matching
│   ├── organization/   # Org structure view
│   └── analytics/      # Team analytics
├── components/
│   ├── ui/            # shadcn/ui components
│   ├── layout/        # Navbar, MainLayout
│   └── features/      # PersonalityRadar, etc.
├── lib/
│   ├── personality.ts # Matching algorithms
│   └── auth-context.tsx # RBAC provider
├── types/
│   └── index.ts       # TypeScript definitions
└── data/
    ├── employees.ts   # Mock employee data
    ├── companies.ts   # Mock company/team data
    └── jobs.ts        # Mock job listings
```

## Development Notes

- **Frontend Only** - This is a mockup with no backend
- **Mock Data** - All data is client-side
- **No Authentication** - Role switching is for demo purposes only
- **No Persistence** - State resets on refresh
- **Responsive Design** - Works on mobile, tablet, and desktop

See **CLAUDE.md** for detailed architecture and implementation guidance.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Run ESLint
```
