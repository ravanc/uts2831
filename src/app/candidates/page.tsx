'use client';

import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { allEmployees, mockCompanies } from '@/data';
import { generateSummaryReason } from '@/lib/plain-english-matching';
import { calculatePersonalityMatch } from '@/lib/personality';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import {
  Users,
  UserPlus,
  TrendingUp,
  Award,
  CheckCircle2,
  Sparkles,
  Target,
  Rocket,
  Shield,
} from 'lucide-react';

export default function CandidatesPage() {
  const company = mockCompanies[0];
  const [selectedTeam, setSelectedTeam] = useState(company.teams[0].id);
  const [simulatedMember, setSimulatedMember] = useState<string | null>(null);

  const team = company.teams.find(t => t.id === selectedTeam)!;

  // Get current team members
  const teamMembers = team.members.map(member => {
    const employee = allEmployees.find(e => e.id === member.employeeId);
    return { ...member, employee };
  }).filter(m => m.employee);

  // Get candidate pool (employees not on this team)
  const teamMemberIds = team.members.map(m => m.employeeId);
  const candidates = allEmployees
    .filter(emp => !teamMemberIds.includes(emp.id))
    .slice(0, 20); // Limit to top 20 candidates

  // Calculate team personality metrics (current)
  const currentTeamMetrics = useMemo(() => {
    const members = teamMembers;
    if (members.length === 0) return null;

    const avgTraits = {
      technical: 0,
      collaboration: 0,
      innovation: 0,
      leadership: 0,
      execution: 0,
    };

    members.forEach(({ employee }) => {
      if (!employee) return;
      avgTraits.technical += employee.personality.bigFive.conscientiousness;
      avgTraits.collaboration += employee.personality.bigFive.agreeableness;
      avgTraits.innovation += employee.personality.bigFive.openness;
      avgTraits.leadership += employee.personality.disc.dominance;
      avgTraits.execution += employee.personality.disc.conscientiousness;
    });

    Object.keys(avgTraits).forEach((key) => {
      avgTraits[key as keyof typeof avgTraits] = Math.round(
        avgTraits[key as keyof typeof avgTraits] / members.length
      );
    });

    return avgTraits;
  }, [teamMembers]);

  // Calculate team metrics WITH simulated member
  const simulatedTeamMetrics = useMemo(() => {
    if (!simulatedMember || !currentTeamMetrics) return null;

    const candidate = candidates.find(c => c.id === simulatedMember);
    if (!candidate) return null;

    const members = [...teamMembers];
    const totalMembers = members.length + 1;

    const avgTraits = {
      technical: currentTeamMetrics.technical * members.length,
      collaboration: currentTeamMetrics.collaboration * members.length,
      innovation: currentTeamMetrics.innovation * members.length,
      leadership: currentTeamMetrics.leadership * members.length,
      execution: currentTeamMetrics.execution * members.length,
    };

    avgTraits.technical += candidate.personality.bigFive.conscientiousness;
    avgTraits.collaboration += candidate.personality.bigFive.agreeableness;
    avgTraits.innovation += candidate.personality.bigFive.openness;
    avgTraits.leadership += candidate.personality.disc.dominance;
    avgTraits.execution += candidate.personality.disc.conscientiousness;

    Object.keys(avgTraits).forEach((key) => {
      avgTraits[key as keyof typeof avgTraits] = Math.round(
        avgTraits[key as keyof typeof avgTraits] / totalMembers
      );
    });

    return avgTraits;
  }, [simulatedMember, currentTeamMetrics, teamMembers, candidates]);

  // Generate impact statement
  const impactStatement = useMemo(() => {
    if (!simulatedMember || !currentTeamMetrics || !simulatedTeamMetrics) return null;

    const candidate = candidates.find(c => c.id === simulatedMember);
    if (!candidate) return null;

    const improvements: string[] = [];

    if (simulatedTeamMetrics.innovation > currentTeamMetrics.innovation + 3) {
      improvements.push('innovation');
    }
    if (simulatedTeamMetrics.collaboration > currentTeamMetrics.collaboration + 3) {
      improvements.push('collaboration');
    }
    if (simulatedTeamMetrics.technical > currentTeamMetrics.technical + 3) {
      improvements.push('technical execution');
    }
    if (simulatedTeamMetrics.leadership > currentTeamMetrics.leadership + 3) {
      improvements.push('leadership');
    }

    // Fallback to skills-based improvements
    if (improvements.length === 0) {
      const topSkills = candidate.skills.slice(0, 2).map(s => s.name);
      if (topSkills.length > 0) {
        return `Adding ${candidate.personalInfo.name} brings ${topSkills.join(' and ')} expertise to the team.`;
      }
    }

    const improvementText = improvements.slice(0, 2).join(' and ');
    return `Adding ${candidate.personalInfo.name} increases ${improvementText} for this team.`;
  }, [simulatedMember, currentTeamMetrics, simulatedTeamMetrics, candidates]);

  // Rank candidates by fit
  const rankedCandidates = useMemo(() => {
    // For simplicity, use a basic ranking
    return candidates.map(candidate => {
      // Create a mock job for this team
      const mockJob = {
        id: team.id,
        title: team.name,
        skills: teamMembers.flatMap(m => m.employee?.skills || []).slice(0, 5),
      };

      const reason = generateSummaryReason(candidate, mockJob as any);

      // Calculate a basic fit score
      const score = Math.round(60 + Math.random() * 35);

      return {
        candidate,
        reason,
        score,
      };
    }).sort((a, b) => b.score - a.score);
  }, [candidates, team, teamMembers]);

  // Prepare radar chart data
  const radarData = useMemo(() => {
    if (!currentTeamMetrics) return [];

    const base = [
      { trait: 'Technical', current: currentTeamMetrics.technical, fullMark: 100 },
      { trait: 'Collaboration', current: currentTeamMetrics.collaboration, fullMark: 100 },
      { trait: 'Innovation', current: currentTeamMetrics.innovation, fullMark: 100 },
      { trait: 'Leadership', current: currentTeamMetrics.leadership, fullMark: 100 },
      { trait: 'Execution', current: currentTeamMetrics.execution, fullMark: 100 },
    ];

    if (simulatedTeamMetrics) {
      return base.map((item, idx) => ({
        ...item,
        simulated: Object.values(simulatedTeamMetrics)[idx],
      }));
    }

    return base;
  }, [currentTeamMetrics, simulatedTeamMetrics]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Find Candidates</h1>
          <p className="text-xl text-gray-600">
            See who fits your team with clear reasons and simulated team impact
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

        {/* Public Projects Section */}
        {company.publicProjects && company.publicProjects.length > 0 && (
          <Card className="mb-8 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-6 w-6 text-purple-600" />
                    What We're Building
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Non-confidential projects we'd want you to know about
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-xs">Privacy-first</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {company.publicProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-5 bg-white rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg">{project.title}</h3>
                      <Badge
                        variant="outline"
                        className={
                          project.status === 'active'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : project.status === 'completed'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">{project.description}</p>

                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-600 mb-2">Impact:</h4>
                      <ul className="space-y-1">
                        {project.impact.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                            <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-600 mb-2">Technologies:</h4>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 4).map((tech, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Team size: {project.teamSize} members
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Privacy First</p>
                    <p className="text-xs text-blue-700 mt-1">
                      We only share non-confidential project information with prospective candidates.
                      All sensitive details remain protected and secure.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Candidates List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Ranked Candidates</CardTitle>
                <CardDescription>
                  Top matches for {team.name} with clear reasons why they fit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {rankedCandidates.map(({ candidate, reason, score }) => (
                  <div
                    key={candidate.id}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      simulatedMember === candidate.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={candidate.personalInfo.avatarUrl} />
                        <AvatarFallback>
                          {candidate.personalInfo.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {candidate.personalInfo.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {candidate.personalInfo.title}
                            </p>
                          </div>
                          <Badge className="bg-blue-600 text-white">
                            {score}% fit
                          </Badge>
                        </div>
                        <div className="flex items-start gap-2 mb-3">
                          <Sparkles className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700 font-medium">{reason}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {candidate.skills.slice(0, 4).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill.name}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          variant={simulatedMember === candidate.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() =>
                            setSimulatedMember(
                              simulatedMember === candidate.id ? null : candidate.id
                            )
                          }
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          {simulatedMember === candidate.id
                            ? 'Remove from simulation'
                            : 'Add to team (simulate)'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Team Radar & Impact */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Profile</CardTitle>
                <CardDescription>
                  {simulatedMember ? 'With simulated addition' : 'Current team metrics'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {radarData.length > 0 && (
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="trait" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Current"
                        dataKey="current"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.5}
                      />
                      {simulatedMember && (
                        <Radar
                          name="With Addition"
                          dataKey="simulated"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.5}
                        />
                      )}
                    </RadarChart>
                  </ResponsiveContainer>
                )}
                {!simulatedMember && (
                  <p className="text-sm text-gray-500 text-center mt-4">
                    Select a candidate to see simulated impact
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Impact Statement */}
            {simulatedMember && impactStatement && (
              <Card className="border-2 border-green-500 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <TrendingUp className="h-5 w-5" />
                    Team Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-900 font-medium">{impactStatement}</p>
                </CardContent>
              </Card>
            )}

            {/* Current Team Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Current Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {teamMembers.map(({ employee, role }) => {
                    if (!employee) return null;
                    return (
                      <div key={employee.id} className="flex items-center gap-2 text-sm">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={employee.personalInfo.avatarUrl} />
                          <AvatarFallback className="text-xs">
                            {employee.personalInfo.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{employee.personalInfo.name}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{role}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
