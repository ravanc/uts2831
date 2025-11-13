'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/main-layout';
import {
  Brain,
  Users,
  TrendingUp,
  Target,
  Sparkles,
  BarChart3,
  User,
  Building2,
  Briefcase,
  Linkedin,
  Search,
  LineChart,
  Shield,
  Zap,
  Upload,
} from 'lucide-react';

export default function Home() {
  const { user, switchRole } = useAuth();
  const [linkedInConnected, setLinkedInConnected] = useState(false);
  const [showChoice, setShowChoice] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const handleLinkedInConnect = () => {
    setLinkedInConnected(true);
    setShowChoice(true);
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, this would upload the file to a server
      setResumeUploaded(true);
      setShowChoice(true);
    }
  };

  const getHeroContent = () => {
    if (user?.role === 'employer') {
      return {
        badge: 'AI-Powered Hiring Platform',
        title: 'Find the Perfect',
        titleHighlight: 'Team Fit',
        description: 'Go beyond resumes. Find candidates who will truly thrive in your team based on personality, skills, and cultural alignment.'
      };
    }
    return {
      badge: 'Privacy-First AI Matching',
      title: 'Find Where You\'ll',
      titleHighlight: 'Actually Thrive',
      description: 'We understand your experiences, not just your resume. Get clear, simple reasons why you\'ll succeed at specific companies and teams.'
    };
  };

  const heroContent = getHeroContent();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-fog py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-mist-blue px-4 py-2 text-sm font-medium text-graphite">
              <Shield className="mr-2 h-4 w-4" />
              {heroContent.badge}
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-graphite md:text-7xl">
              {heroContent.title}
              <span className="bg-gradient-to-r from-glacier to-lavender bg-clip-text text-transparent">
                {' '}{heroContent.titleHighlight}
              </span>
            </h1>
            <p className="mb-10 text-xl text-slate md:text-2xl">
              {heroContent.description}
            </p>

            {user?.role === 'employee' ? (
              <>
                {!linkedInConnected && !resumeUploaded ? (
                  <div className="mb-8">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-glacier-dark hover:bg-glacier-darker text-white px-8 py-6 text-lg"
                      onClick={handleLinkedInConnect}
                    >
                      <Linkedin className="mr-3 h-6 w-6" />
                      Link my LinkedIn profile
                    </Button>
                    <p className="mt-3 text-sm text-slate">Connect in seconds. Your data stays private.</p>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6 max-w-md mx-auto">
                      <div className="flex-1 border-t border-slate/30"></div>
                      <span className="text-sm text-slate">or</span>
                      <div className="flex-1 border-t border-slate/30"></div>
                    </div>

                    {/* Resume Upload */}
                    <div className="flex flex-col items-center gap-2">
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 px-6 py-3 border-2 border-slate/30 rounded-lg hover:border-glacier-dark hover:bg-glacier/5 transition-all">
                          <Upload className="h-5 w-5 text-slate" />
                          <span className="text-slate font-medium">Upload Resume</span>
                        </div>
                        <input
                          id="resume-upload"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={handleResumeUpload}
                        />
                      </label>
                      <p className="text-xs text-slate">PDF, DOC, or DOCX</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-8">
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg inline-block">
                      <p className="text-green-800 font-medium flex items-center gap-2">
                        {linkedInConnected ? (
                          <>
                            <Linkedin className="h-5 w-5" />
                            LinkedIn connected successfully!
                          </>
                        ) : (
                          <>
                            <Upload className="h-5 w-5" />
                            Resume uploaded successfully!
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {showChoice && (
                  <div className="mb-8 animate-in fade-in duration-500">
                    <p className="text-lg font-medium text-graphite mb-6">
                      What would you like to do?
                    </p>
                    <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
                      <Link href="/jobs">
                        <Card className="cursor-pointer border-2 hover:border-glacier-dark hover:shadow-lg transition-all h-full shadow-sm">
                          <CardHeader>
                            <Search className="h-12 w-12 text-glacier-dark mb-2" />
                            <CardTitle>Job Surfing</CardTitle>
                            <CardDescription>
                              Find companies and teams where you'll thrive with clear reasons why
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Button className="w-full">Find where I'll thrive</Button>
                          </CardContent>
                        </Card>
                      </Link>
                      <Link href="/experience">
                        <Card className="cursor-pointer border-2 hover:border-lavender-dark hover:shadow-lg transition-all h-full shadow-sm">
                          <CardHeader>
                            <LineChart className="h-12 w-12 text-lavender-dark mb-2" />
                            <CardTitle>Review My Experience</CardTitle>
                            <CardDescription>
                              See insights about your career journey, best teams, and satisfaction over time
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Button variant="outline" className="w-full">Review my journey</Button>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  </div>
                )}

                {!showChoice && (
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Link href="/profile">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        <User className="mr-2 h-5 w-5" />
                        View Sample Profile
                      </Button>
                    </Link>
                    <Link href="/jobs">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        <Briefcase className="mr-2 h-5 w-5" />
                        Explore Jobs
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/candidates">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Search className="mr-2 h-5 w-5" />
                    Find Candidates
                  </Button>
                </Link>
                <Link href="/applications">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <Briefcase className="mr-2 h-5 w-5" />
                    View Applications
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-graphite">
              Why We're Different
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate">
              We understand your experiences and projects, not just your resume.
              Get clear, plain-English insights about where you'll succeed.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 hover:shadow-lg transition-shadow shadow-sm">
              <CardHeader>
                <Zap className="mb-4 h-12 w-12 text-glacier-dark" />
                <CardTitle>Instant Understanding</CardTitle>
                <CardDescription>
                  Get clear reasons why you fit: "You build crisp slides and narratives"
                  — based on your actual work, not generic tests.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow shadow-sm">
              <CardHeader>
                <Shield className="mb-4 h-12 w-12 text-glacier-dark" />
                <CardTitle>Privacy-First</CardTitle>
                <CardDescription>
                  Companies share non-confidential projects only. Your data stays secure.
                  No company secrets revealed.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow shadow-sm">
              <CardHeader>
                <Target className="mb-4 h-12 w-12 text-lavender-dark" />
                <CardTitle>Experience-Based Matching</CardTitle>
                <CardDescription>
                  Match based on your entrepreneurial interests, module projects, and
                  actual skills — not just keywords.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow shadow-sm">
              <CardHeader>
                <Users className="mb-4 h-12 w-12 text-glacier-dark" />
                <CardTitle>Team Impact Preview</CardTitle>
                <CardDescription>
                  See exactly how adding you improves team capabilities:
                  "Increases narrative craft and async speed."
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow shadow-sm">
              <CardHeader>
                <TrendingUp className="mb-4 h-12 w-12 text-lavender-dark" />
                <CardTitle>Career Insights</CardTitle>
                <CardDescription>
                  Track your satisfaction over time, identify your best teams,
                  and understand your career trajectory.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow shadow-sm">
              <CardHeader>
                <BarChart3 className="mb-4 h-12 w-12 text-glacier-dark" />
                <CardTitle>Clear, Simple Reasons</CardTitle>
                <CardDescription>
                  No jargon. Just plain explanations of fit based on real projects
                  and team needs.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Role Demo Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-graphite">
              Explore Different Views
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate">
              This is a demo app. Switch between different roles to see how the platform
              works for employees and employers.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <Card
              className="cursor-pointer border-2 hover:border-glacier-dark hover:shadow-lg transition-all shadow-sm"
              onClick={() => switchRole('employee')}
            >
              <CardHeader>
                <User className="mb-4 h-12 w-12 text-glacier-dark" />
                <CardTitle>Employee View</CardTitle>
                <CardDescription>
                  Build your profile, showcase projects, and find jobs that match
                  your personality and skills.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  variant={user?.role === 'employee' ? 'default' : 'outline'}
                >
                  {user?.role === 'employee' ? 'Current View' : 'Switch to Employee'}
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer border-2 hover:border-glacier-dark hover:shadow-lg transition-all shadow-sm"
              onClick={() => switchRole('employer')}
            >
              <CardHeader>
                <Briefcase className="mb-4 h-12 w-12 text-glacier-dark" />
                <CardTitle>Employer View</CardTitle>
                <CardDescription>
                  Search for candidates, view personality matches, and find the
                  perfect fit for your team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  variant={user?.role === 'employer' ? 'default' : 'outline'}
                >
                  {user?.role === 'employer' ? 'Current View' : 'Switch to Employer'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-glacier-dark to-lavender-dark py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="mb-8 text-xl opacity-95">
            Start exploring the platform with your preferred view
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/profile">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
