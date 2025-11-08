'use client';

import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { mockCompanies, allEmployees } from '@/data';
import { getMBTIDescription } from '@/lib/personality';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Users,
  Target,
  Lightbulb,
  UserPlus,
  Award,
} from 'lucide-react';
import { BigFiveTraits } from '@/types';

export default function AnalyticsPage() {
  const company = mockCompanies[0];
  const [selectedTeam, setSelectedTeam] = useState(company.teams[0].id);

  const team = company.teams.find(t => t.id === selectedTeam)!;

  const teamMembers = team.members.map(member => {
    const employee = allEmployees.find(e => e.id === member.employeeId);
    return { ...member, employee };
  }).filter(m => m.employee);

  // Calculate personality metrics
  const personalityMetrics = useMemo(() => {
    if (teamMembers.length === 0) return null;

    // Average Big Five scores
    const avgBigFive: BigFiveTraits = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0,
    };

    teamMembers.forEach(({ employee }) => {
      if (!employee) return;
      avgBigFive.openness += employee.personality.bigFive.openness;
      avgBigFive.conscientiousness += employee.personality.bigFive.conscientiousness;
      avgBigFive.extraversion += employee.personality.bigFive.extraversion;
      avgBigFive.agreeableness += employee.personality.bigFive.agreeableness;
      avgBigFive.neuroticism += employee.personality.bigFive.neuroticism;
    });

    Object.keys(avgBigFive).forEach((key) => {
      avgBigFive[key as keyof BigFiveTraits] = Math.round(
        avgBigFive[key as keyof BigFiveTraits] / teamMembers.length
      );
    });

    // MBTI distribution
    const mbtiCounts: Record<string, number> = {};
    teamMembers.forEach(({ employee }) => {
      if (!employee) return;
      const type = employee.personality.mbti.type;
      mbtiCounts[type] = (mbtiCounts[type] || 0) + 1;
    });

    // Average DISC scores
    const avgDISC = {
      dominance: 0,
      influence: 0,
      steadiness: 0,
      conscientiousness: 0,
    };

    teamMembers.forEach(({ employee }) => {
      if (!employee) return;
      avgDISC.dominance += employee.personality.disc.dominance;
      avgDISC.influence += employee.personality.disc.influence;
      avgDISC.steadiness += employee.personality.disc.steadiness;
      avgDISC.conscientiousness += employee.personality.disc.conscientiousness;
    });

    Object.keys(avgDISC).forEach((key) => {
      avgDISC[key as keyof typeof avgDISC] = Math.round(
        avgDISC[key as keyof typeof avgDISC] / teamMembers.length
      );
    });

    return {
      avgBigFive,
      mbtiCounts,
      avgDISC,
    };
  }, [teamMembers]);

  // Team insights
  const teamInsights = useMemo(() => {
    const insights: {
      type: 'strength' | 'opportunity' | 'warning';
      title: string;
      description: string;
    }[] = [];

    if (!personalityMetrics) return insights;

    // Diversity check
    const uniqueMBTI = Object.keys(personalityMetrics.mbtiCounts).length;
    if (uniqueMBTI / teamMembers.length >= 0.7) {
      insights.push({
        type: 'strength',
        title: 'High Personality Diversity',
        description: `Team has ${uniqueMBTI} different MBTI types, promoting diverse perspectives and creative problem-solving.`,
      });
    } else if (uniqueMBTI / teamMembers.length <= 0.3) {
      insights.push({
        type: 'warning',
        title: 'Low Personality Diversity',
        description: 'Team may benefit from more diverse personality types to avoid groupthink.',
      });
    }

    // Balance checks
    if (personalityMetrics.avgBigFive.extraversion > 70) {
      insights.push({
        type: 'opportunity',
        title: 'Highly Extraverted Team',
        description: 'Team is very social and collaborative. Consider providing quiet focus time for deep work.',
      });
    } else if (personalityMetrics.avgBigFive.extraversion < 30) {
      insights.push({
        type: 'opportunity',
        title: 'Highly Introverted Team',
        description: 'Team prefers independent work. Structured collaboration sessions may enhance team cohesion.',
      });
    }

    if (personalityMetrics.avgBigFive.conscientiousness > 75) {
      insights.push({
        type: 'strength',
        title: 'Highly Organized Team',
        description: 'Team is detail-oriented and organized. Great for complex, structured projects.',
      });
    }

    if (personalityMetrics.avgBigFive.openness > 75) {
      insights.push({
        type: 'strength',
        title: 'Innovation-Focused',
        description: 'Team is highly creative and open to new ideas. Excellent for innovation and R&D projects.',
      });
    }

    // DISC balance
    const discValues = Object.values(personalityMetrics.avgDISC);
    const maxDisc = Math.max(...discValues);
    const minDisc = Math.min(...discValues);

    if (maxDisc - minDisc < 20) {
      insights.push({
        type: 'strength',
        title: 'Balanced Work Styles',
        description: 'Team has a good balance across all DISC dimensions, supporting various work approaches.',
      });
    }

    return insights;
  }, [personalityMetrics, teamMembers]);

  // Hiring recommendations
  const hiringRecommendations = useMemo(() => {
    if (!personalityMetrics) return [];

    const recommendations: {
      personality: string;
      reasoning: string;
      impact: string;
    }[] = [];

    // Check for gaps
    if (personalityMetrics.avgBigFive.extraversion < 40) {
      recommendations.push({
        personality: 'Extraverted (ENFP, ENTP, ENFJ, ENTJ)',
        reasoning: 'Team is predominantly introverted. An extraverted team member could improve communication and collaboration.',
        impact: 'Enhanced team cohesion and external stakeholder engagement',
      });
    }

    if (personalityMetrics.avgBigFive.conscientiousness < 50) {
      recommendations.push({
        personality: 'Organized & Detail-oriented (ISTJ, ESTJ, ISFJ)',
        reasoning: 'Team could benefit from more structure and organization.',
        impact: 'Improved project management and attention to detail',
      });
    }

    if (personalityMetrics.avgDISC.influence < 40) {
      recommendations.push({
        personality: 'High Influence (Persuasive & Enthusiastic)',
        reasoning: 'Team has low influence scores. Someone persuasive could help with stakeholder buy-in.',
        impact: 'Better cross-team collaboration and influence',
      });
    }

    return recommendations;
  }, [personalityMetrics]);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Team Analytics</h1>
          <p className="text-xl text-gray-600">
            Data-driven insights into team dynamics and composition
          </p>
        </div>

        {/* Team Selector */}
        <div className="mb-8">
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              {company.teams.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name} ({t.members.length} members)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Team Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{teamMembers.length}</span>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Active members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Personality Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">
                  {personalityMetrics ? Object.keys(personalityMetrics.mbtiCounts).length : 0}
                </span>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Unique MBTI types</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Team Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">
                  {personalityMetrics
                    ? Math.round((Object.keys(personalityMetrics.mbtiCounts).length / teamMembers.length) * 100)
                    : 0}%
                </span>
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Diversity score</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{teamInsights.length}</span>
                <Lightbulb className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Generated insights</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personality">Personality</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="hiring">Hiring</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* MBTI Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>MBTI Type Distribution</CardTitle>
                  <CardDescription>Breakdown of personality types in the team</CardDescription>
                </CardHeader>
                <CardContent>
                  {personalityMetrics && (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={Object.entries(personalityMetrics.mbtiCounts).map(([type, count]) => ({
                            name: type,
                            value: count,
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {Object.entries(personalityMetrics.mbtiCounts).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Big Five Average */}
              <Card>
                <CardHeader>
                  <CardTitle>Big Five Team Profile</CardTitle>
                  <CardDescription>Average personality traits across team</CardDescription>
                </CardHeader>
                <CardContent>
                  {personalityMetrics && (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={[
                          { trait: 'Openness', score: personalityMetrics.avgBigFive.openness },
                          { trait: 'Conscientiousness', score: personalityMetrics.avgBigFive.conscientiousness },
                          { trait: 'Extraversion', score: personalityMetrics.avgBigFive.extraversion },
                          { trait: 'Agreeableness', score: personalityMetrics.avgBigFive.agreeableness },
                          { trait: 'Emotional Stability', score: 100 - personalityMetrics.avgBigFive.neuroticism },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="trait" angle={-45} textAnchor="end" height={100} />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="score" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Personality Tab */}
          <TabsContent value="personality" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* DISC Profile */}
              <Card>
                <CardHeader>
                  <CardTitle>DISC Work Style Profile</CardTitle>
                  <CardDescription>Average work style preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {personalityMetrics && (
                    <>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Dominance</span>
                          <span className="text-sm text-gray-600">{personalityMetrics.avgDISC.dominance}%</span>
                        </div>
                        <Progress value={personalityMetrics.avgDISC.dominance} className="h-3" />
                        <p className="text-xs text-gray-500 mt-1">Results-oriented and direct</p>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Influence</span>
                          <span className="text-sm text-gray-600">{personalityMetrics.avgDISC.influence}%</span>
                        </div>
                        <Progress value={personalityMetrics.avgDISC.influence} className="h-3" />
                        <p className="text-xs text-gray-500 mt-1">Enthusiastic and persuasive</p>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Steadiness</span>
                          <span className="text-sm text-gray-600">{personalityMetrics.avgDISC.steadiness}%</span>
                        </div>
                        <Progress value={personalityMetrics.avgDISC.steadiness} className="h-3" />
                        <p className="text-xs text-gray-500 mt-1">Patient and reliable</p>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Conscientiousness</span>
                          <span className="text-sm text-gray-600">{personalityMetrics.avgDISC.conscientiousness}%</span>
                        </div>
                        <Progress value={personalityMetrics.avgDISC.conscientiousness} className="h-3" />
                        <p className="text-xs text-gray-500 mt-1">Detail-oriented and systematic</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* MBTI Details */}
              <Card>
                <CardHeader>
                  <CardTitle>MBTI Type Details</CardTitle>
                  <CardDescription>Breakdown by personality type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {personalityMetrics && Object.entries(personalityMetrics.mbtiCounts).map(([type, count]) => {
                      const mbtiInfo = getMBTIDescription(type as any);
                      const percentage = Math.round((count / teamMembers.length) * 100);

                      return (
                        <div key={type} className="border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold">{type}</span>
                                <Badge variant="outline">{count} member{count !== 1 ? 's' : ''}</Badge>
                              </div>
                              <p className="text-sm text-gray-600">{mbtiInfo.title}</p>
                            </div>
                            <span className="text-2xl font-bold text-gray-300">{percentage}%</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {mbtiInfo.strengths.slice(0, 3).map((strength, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights">
            <div className="grid gap-6 md:grid-cols-2">
              {teamInsights.map((insight, idx) => {
                const Icon = insight.type === 'strength'
                  ? CheckCircle
                  : insight.type === 'opportunity'
                  ? TrendingUp
                  : AlertCircle;

                const colorClass = insight.type === 'strength'
                  ? 'bg-green-50 border-green-200'
                  : insight.type === 'opportunity'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-yellow-50 border-yellow-200';

                const iconColor = insight.type === 'strength'
                  ? 'text-green-600'
                  : insight.type === 'opportunity'
                  ? 'text-blue-600'
                  : 'text-yellow-600';

                return (
                  <Card key={idx} className={`border-2 ${colorClass}`}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Icon className={`h-6 w-6 ${iconColor} flex-shrink-0`} />
                        <div>
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {insight.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Hiring Tab */}
          <TabsContent value="hiring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hiring Recommendations</CardTitle>
                <CardDescription>
                  Personality profiles that would complement and balance the team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {hiringRecommendations.map((rec, idx) => (
                  <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <UserPlus className="h-6 w-6 text-blue-600 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">{rec.personality}</h4>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-gray-600">Reasoning:</span>
                            <p className="text-sm text-gray-700">{rec.reasoning}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Expected Impact:</span>
                            <p className="text-sm text-gray-700">{rec.impact}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {hiringRecommendations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                    <p className="text-lg font-medium">Team is well-balanced!</p>
                    <p className="text-sm">No critical personality gaps identified</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
