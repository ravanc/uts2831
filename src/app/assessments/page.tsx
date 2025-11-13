'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle, ArrowRight, Target, Users, Activity } from 'lucide-react';

interface AssessmentStatus {
  bigFive: boolean;
  mbti: boolean;
  disc: boolean;
}

export default function AssessmentsPage() {
  const [status, setStatus] = useState<AssessmentStatus>({
    bigFive: false,
    mbti: false,
    disc: false,
  });

  useEffect(() => {
    const storedProfile = localStorage.getItem('userPersonalityProfile');
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      setStatus({
        bigFive: !!profile.bigFive,
        mbti: !!profile.mbti,
        disc: !!profile.disc,
      });
    }
  }, []);

  const assessments = [
    {
      id: 'big-five',
      title: 'Big Five Personality Test',
      description: 'Scientifically validated assessment measuring five core personality dimensions',
      icon: Brain,
      color: 'blue',
      route: '/assessments/big-five',
      completed: status.bigFive,
      duration: '10-15 minutes',
      questions: 30,
      dimensions: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'],
    },
    {
      id: 'mbti',
      title: 'MBTI Personality Test',
      description: 'Discover your personality type across four key dimensions',
      icon: Users,
      color: 'purple',
      route: '/assessments/mbti',
      completed: status.mbti,
      duration: '10-12 minutes',
      questions: 32,
      dimensions: ['Introversion/Extraversion', 'Sensing/Intuition', 'Thinking/Feeling', 'Judging/Perceiving'],
    },
    {
      id: 'disc',
      title: 'DISC Work Style Assessment',
      description: 'Understand your work style and communication preferences',
      icon: Activity,
      color: 'green',
      route: '/assessments/disc',
      completed: status.disc,
      duration: '8-10 minutes',
      questions: 24,
      dimensions: ['Dominance', 'Influence', 'Steadiness', 'Conscientiousness'],
    },
  ];

  const completedCount = Object.values(status).filter(Boolean).length;
  const totalAssessments = 3;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Personality Assessments</h1>
          <p className="text-muted-foreground text-lg">
            Complete all three assessments to build your comprehensive personality profile
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant={completedCount === totalAssessments ? 'default' : 'secondary'} className="text-sm">
              {completedCount} of {totalAssessments} completed
            </Badge>
          </div>
        </div>

        {completedCount === totalAssessments && (
          <Card className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="flex items-center gap-4 pt-6">
              <CheckCircle className="h-12 w-12 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">All Assessments Complete!</h3>
                <p className="text-muted-foreground">
                  You've completed all personality assessments. Your profile is now optimized for job matching.
                </p>
              </div>
              <Link href="/profile">
                <Button>View Profile</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {assessments.map((assessment) => {
            const Icon = assessment.icon;
            return (
              <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-${assessment.color}-100`}>
                        <Icon className={`h-6 w-6 text-${assessment.color}-600`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-2xl">{assessment.title}</CardTitle>
                          {assessment.completed && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-base">
                          {assessment.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Link href={assessment.route}>
                      <Button>
                        {assessment.completed ? 'Retake' : 'Start'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 text-sm text-muted-foreground">Details</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <Target className="inline h-3 w-3 mr-1" />
                          {assessment.questions} questions
                        </p>
                        <p>
                          <Brain className="inline h-3 w-3 mr-1" />
                          {assessment.duration}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-sm text-muted-foreground">Dimensions Measured</h4>
                      <div className="flex flex-wrap gap-1">
                        {assessment.dimensions.map((dim, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {dim}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 bg-muted/50">
          <CardHeader>
            <CardTitle>Why Complete These Assessments?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                <strong>Better Job Matches:</strong> Our algorithm uses your personality profile to find roles where you'll thrive
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                <strong>Team Compatibility:</strong> Employers can assess how well you'd fit with existing teams
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                <strong>Self-Awareness:</strong> Gain insights into your work style, communication preferences, and ideal work environment
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                <strong>Evidence-Based:</strong> All three frameworks are scientifically validated and widely used in professional settings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
