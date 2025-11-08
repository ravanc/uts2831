'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCompanies, allEmployees } from '@/data';
import { getMBTIDescription } from '@/lib/personality';
import {
  Building2,
  Users,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  User,
  Mail,
  Briefcase,
  Rocket,
  Shield,
  CheckCircle2,
} from 'lucide-react';

export default function OrganizationPage() {
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  // Using first company for demo
  const company = mockCompanies[0];

  const toggleTeam = (teamId: string) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeams(newExpanded);
  };

  const getTeamMembers = (teamId: string) => {
    const team = company.teams.find(t => t.id === teamId);
    if (!team) return [];

    return team.members.map(member => {
      const employee = allEmployees.find(e => e.id === member.employeeId);
      return { ...member, employee };
    }).filter(m => m.employee);
  };

  const selectedTeamData = selectedTeam
    ? company.teams.find(t => t.id === selectedTeam)
    : null;

  const selectedTeamMembers = selectedTeam
    ? getTeamMembers(selectedTeam)
    : [];

  // Calculate team personality diversity
  const calculateTeamDiversity = (teamId: string) => {
    const members = getTeamMembers(teamId);
    if (members.length === 0) return { mbtiTypes: [], diversity: 0 };

    const mbtiTypes = members.map(m => m.employee!.personality.mbti.type);
    const uniqueTypes = new Set(mbtiTypes);

    return {
      mbtiTypes: Array.from(uniqueTypes),
      diversity: Math.round((uniqueTypes.size / members.length) * 100),
    };
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Organization Structure</h1>
          <p className="text-xl text-gray-600">
            Visualize your organization with personality insights
          </p>
        </div>

        {/* Company Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-3xl">
                {company.name.substring(0, 2)}
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{company.name}</CardTitle>
                <CardDescription className="text-base">
                  {company.industry} • {company.size} employees • {company.location}
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-3">
                  {company.culture.slice(0, 3).map((trait, idx) => (
                    <Badge key={idx} variant="outline">{trait}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{company.teams.length}</p>
                  <p className="text-sm text-gray-600">Active Teams</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {company.teams.reduce((sum, team) => sum + team.members.length, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Employees</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {company.teams.filter(t => t.department === 'Engineering').length}
                  </p>
                  <p className="text-sm text-gray-600">Engineering Teams</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Public Projects Section */}
        {company.publicProjects && company.publicProjects.length > 0 && (
          <Card className="mb-8 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-6 w-6 text-purple-600" />
                    Active Projects
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Public-facing projects that prospective candidates should know about
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-xs">Non-confidential</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {company.publicProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-5 bg-white rounded-lg border-2 border-gray-200"
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
                      <h4 className="text-xs font-semibold text-gray-600 mb-2">Key Impact:</h4>
                      <ul className="space-y-1">
                        {project.impact.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                            <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-600 mb-2">Tech Stack:</h4>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 5).map((tech, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 border-t pt-2">
                      Team size: {project.teamSize} members
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Privacy-First Approach</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Only non-confidential project information is shared here. Sensitive details,
                      client names, and proprietary information remain protected at all times.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Org Chart */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Teams & Structure</CardTitle>
                <CardDescription>
                  Click on a team to see details and member composition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.teams.map((team) => {
                  const isExpanded = expandedTeams.has(team.id);
                  const members = getTeamMembers(team.id);
                  const diversity = calculateTeamDiversity(team.id);
                  const manager = allEmployees.find(e => e.id === team.managerId);

                  return (
                    <div key={team.id} className="border rounded-lg overflow-hidden">
                      {/* Team Header */}
                      <div
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${
                          selectedTeam === team.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                        onClick={() => setSelectedTeam(team.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{team.name}</h3>
                              <Badge variant="outline">{team.department}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {members.length} members • {diversity.mbtiTypes.length} personality types
                            </p>
                            {manager && (
                              <p className="text-sm text-gray-500">
                                Manager: {manager.personalInfo.name}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTeam(team.id);
                            }}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Team Members (collapsed) */}
                      {isExpanded && (
                        <div className="border-t bg-gray-50 p-4 space-y-2">
                          {members.map(({ employee, role }) => {
                            if (!employee) return null;
                            return (
                              <div
                                key={employee.id}
                                className="flex items-center gap-3 p-2 bg-white rounded border"
                              >
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={employee.personalInfo.avatarUrl} />
                                  <AvatarFallback>
                                    {employee.personalInfo.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="font-medium">{employee.personalInfo.name}</p>
                                  <p className="text-sm text-gray-600">{role}</p>
                                </div>
                                <Badge variant="outline">
                                  {employee.personality.mbti.type}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Team Details */}
          <div>
            {selectedTeamData ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedTeamData.name}</CardTitle>
                  <CardDescription>{selectedTeamData.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Team Goals */}
                  <div>
                    <h4 className="font-semibold mb-3">Team Goals</h4>
                    <ul className="space-y-2">
                      {selectedTeamData.goals.map((goal, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Personality Distribution */}
                  <div>
                    <h4 className="font-semibold mb-3">Personality Distribution (MBTI)</h4>
                    <div className="flex flex-wrap gap-2">
                      {calculateTeamDiversity(selectedTeam!).mbtiTypes.map((type) => {
                        const count = selectedTeamMembers.filter(
                          m => m.employee?.personality.mbti.type === type
                        ).length;
                        const mbtiInfo = getMBTIDescription(type);
                        return (
                          <div
                            key={type}
                            className="border rounded-lg p-3 flex-1 min-w-[120px]"
                          >
                            <div className="text-2xl font-bold text-center mb-1">{type}</div>
                            <div className="text-xs text-center text-gray-600 mb-1">
                              {mbtiInfo.title}
                            </div>
                            <div className="text-center">
                              <Badge variant="outline">{count} member{count !== 1 ? 's' : ''}</Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Team Insights */}
                  <div>
                    <h4 className="font-semibold mb-3">Team Insights</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                        <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-green-900">Strong Diversity</p>
                          <p className="text-sm text-green-700">
                            Team has {calculateTeamDiversity(selectedTeam!).mbtiTypes.length} different personality types,
                            promoting diverse perspectives
                          </p>
                        </div>
                      </div>

                      {selectedTeamMembers.length > 5 && (
                        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <Users className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-blue-900">Good Team Size</p>
                            <p className="text-sm text-blue-700">
                              Team size of {selectedTeamMembers.length} is ideal for collaboration and communication
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedTeamMembers.some(m =>
                        ['INTJ', 'INTP', 'ENTJ', 'ENTP'].includes(m.employee?.personality.mbti.type || '')
                      ) && selectedTeamMembers.some(m =>
                        ['ISFJ', 'ESFJ', 'ISFP', 'ESFP'].includes(m.employee?.personality.mbti.type || '')
                      ) && (
                        <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-yellow-900">Communication Opportunity</p>
                            <p className="text-sm text-yellow-700">
                              Mix of thinking and feeling types may need structured communication practices
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Team Members List */}
                  <div>
                    <h4 className="font-semibold mb-3">Team Members</h4>
                    <div className="space-y-2">
                      {selectedTeamMembers.map(({ employee, role }) => {
                        if (!employee) return null;
                        const mbtiInfo = getMBTIDescription(employee.personality.mbti.type);

                        return (
                          <div key={employee.id} className="border rounded-lg p-3">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={employee.personalInfo.avatarUrl} />
                                <AvatarFallback>
                                  {employee.personalInfo.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                  <div>
                                    <h5 className="font-semibold">{employee.personalInfo.name}</h5>
                                    <p className="text-sm text-gray-600">{role}</p>
                                  </div>
                                  <Badge variant="outline">
                                    {employee.personality.mbti.type}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">
                                  {mbtiInfo.title} • {employee.personalInfo.title}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {employee.skills.slice(0, 3).map((skill, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {skill.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a Team</h3>
                  <p className="text-gray-600">
                    Click on a team from the list to view detailed information
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
