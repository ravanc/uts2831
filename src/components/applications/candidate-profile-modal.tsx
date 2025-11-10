'use client';

import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeProfile, Job, Team } from '@/types';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Briefcase,
  GraduationCap,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Users,
  Target,
  Brain,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface CandidateProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: EmployeeProfile | null;
  job: Job | null;
  matchScore: number;
  team?: Team | null;
  teamMembers?: EmployeeProfile[];
}

export function CandidateProfileModal({
  open,
  onOpenChange,
  candidate,
  job,
  matchScore,
  team,
  teamMembers = [],
}: CandidateProfileModalProps) {
  // Calculate current team averages
  const currentTeamMetrics = useMemo(() => {
    if (!teamMembers.length) return null;

    const totalMembers = teamMembers.length;
    const avgBigFive = {
      openness: teamMembers.reduce((sum, m) => sum + m.personality.bigFive.openness, 0) / totalMembers,
      conscientiousness: teamMembers.reduce((sum, m) => sum + m.personality.bigFive.conscientiousness, 0) / totalMembers,
      extraversion: teamMembers.reduce((sum, m) => sum + m.personality.bigFive.extraversion, 0) / totalMembers,
      agreeableness: teamMembers.reduce((sum, m) => sum + m.personality.bigFive.agreeableness, 0) / totalMembers,
      neuroticism: teamMembers.reduce((sum, m) => sum + m.personality.bigFive.neuroticism, 0) / totalMembers,
    };

    return avgBigFive;
  }, [teamMembers]);

  // Calculate team metrics WITH candidate
  const projectedTeamMetrics = useMemo(() => {
    if (!candidate || !currentTeamMetrics) return null;

    const newTotal = teamMembers.length + 1;
    const projected = {
      openness: (currentTeamMetrics.openness * teamMembers.length + candidate.personality.bigFive.openness) / newTotal,
      conscientiousness: (currentTeamMetrics.conscientiousness * teamMembers.length + candidate.personality.bigFive.conscientiousness) / newTotal,
      extraversion: (currentTeamMetrics.extraversion * teamMembers.length + candidate.personality.bigFive.extraversion) / newTotal,
      agreeableness: (currentTeamMetrics.agreeableness * teamMembers.length + candidate.personality.bigFive.agreeableness) / newTotal,
      neuroticism: (currentTeamMetrics.neuroticism * teamMembers.length + candidate.personality.bigFive.neuroticism) / newTotal,
    };

    return projected;
  }, [candidate, currentTeamMetrics, teamMembers]);

  // Calculate improvements
  const improvements = useMemo(() => {
    if (!currentTeamMetrics || !projectedTeamMetrics) return null;

    return {
      openness: projectedTeamMetrics.openness - currentTeamMetrics.openness,
      conscientiousness: projectedTeamMetrics.conscientiousness - currentTeamMetrics.conscientiousness,
      extraversion: projectedTeamMetrics.extraversion - currentTeamMetrics.extraversion,
      agreeableness: projectedTeamMetrics.agreeableness - currentTeamMetrics.agreeableness,
      neuroticism: projectedTeamMetrics.neuroticism - currentTeamMetrics.neuroticism,
    };
  }, [currentTeamMetrics, projectedTeamMetrics]);

  // Prepare Big Five radar chart data
  const bigFiveData = useMemo(() => {
    if (!candidate) return [];
    const bf = candidate.personality.bigFive;
    return [
      { trait: 'Openness', value: bf.openness, fullMark: 100 },
      { trait: 'Conscientiousness', value: bf.conscientiousness, fullMark: 100 },
      { trait: 'Extraversion', value: bf.extraversion, fullMark: 100 },
      { trait: 'Agreeableness', value: bf.agreeableness, fullMark: 100 },
      { trait: 'Emotional Stability', value: 100 - bf.neuroticism, fullMark: 100 },
    ];
  }, [candidate]);

  // Prepare comparison chart data
  const comparisonData = useMemo(() => {
    if (!currentTeamMetrics || !projectedTeamMetrics) return [];

    return [
      {
        trait: 'Openness',
        current: Math.round(currentTeamMetrics.openness),
        projected: Math.round(projectedTeamMetrics.openness),
      },
      {
        trait: 'Conscientiousness',
        current: Math.round(currentTeamMetrics.conscientiousness),
        projected: Math.round(projectedTeamMetrics.conscientiousness),
      },
      {
        trait: 'Extraversion',
        current: Math.round(currentTeamMetrics.extraversion),
        projected: Math.round(projectedTeamMetrics.extraversion),
      },
      {
        trait: 'Agreeableness',
        current: Math.round(currentTeamMetrics.agreeableness),
        projected: Math.round(projectedTeamMetrics.agreeableness),
      },
      {
        trait: 'Emotional Stability',
        current: Math.round(100 - currentTeamMetrics.neuroticism),
        projected: Math.round(100 - projectedTeamMetrics.neuroticism),
      },
    ];
  }, [currentTeamMetrics, projectedTeamMetrics]);

  // Generate insights
  const generateInsights = () => {
    if (!improvements) return [];

    const insights = [];
    const traits = Object.entries(improvements) as [keyof typeof improvements, number][];

    const positiveChanges = traits
      .filter(([trait, change]) => trait !== 'neuroticism' && Math.abs(change) > 3)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));

    if (positiveChanges.length > 0) {
      const [trait, change] = positiveChanges[0];
      const traitName = trait.charAt(0).toUpperCase() + trait.slice(1);
      if (change > 0) {
        insights.push({
          type: 'positive',
          text: `Increases team ${traitName} by ${Math.abs(change).toFixed(1)} points, enhancing ${getTraitBenefit(trait)}`,
        });
      } else {
        insights.push({
          type: 'neutral',
          text: `Slightly balances team ${traitName}, providing ${getTraitBenefit(trait)}`,
        });
      }
    }

    // Check for diversity
    if (candidate) {
      const uniqueMBTI = new Set(teamMembers.map(m => m.personality.mbti.type));
      if (!uniqueMBTI.has(candidate.personality.mbti.type)) {
        insights.push({
          type: 'positive',
          text: `Adds new MBTI type (${candidate.personality.mbti.type}) to the team, increasing cognitive diversity`,
        });
      }
    }

    // Check for skill gaps
    if (candidate && job) {
      const currentTeamSkills = new Set(teamMembers.flatMap(m => m.skills.map(s => s.name)));
      const requiredSkills = job.skills.filter(s => s.required).map(s => s.name);
      const candidateSkills = candidate.skills.map(s => s.name);
      const newSkills = candidateSkills.filter(s => requiredSkills.includes(s) && !currentTeamSkills.has(s));

      if (newSkills.length > 0) {
        insights.push({
          type: 'positive',
          text: `Brings critical skills currently missing: ${newSkills.slice(0, 3).join(', ')}`,
        });
      }
    }

    return insights;
  };

  const getTraitBenefit = (trait: string) => {
    const benefits: Record<string, string> = {
      openness: 'creativity and innovation',
      conscientiousness: 'reliability and organization',
      extraversion: 'team energy and communication',
      agreeableness: 'collaboration and harmony',
      neuroticism: 'stability and resilience',
    };
    return benefits[trait] || 'team dynamics';
  };

  const insights = generateInsights();

  if (!candidate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{candidate.personalInfo.name}</DialogTitle>
              <DialogDescription className="text-lg mt-1">
                {candidate.personalInfo.title}
              </DialogDescription>
              {job && (
                <Badge className="mt-2 bg-glacier-dark text-white">
                  {matchScore}% Match for {job.title}
                </Badge>
              )}
            </div>
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-glacier-dark to-lavender-dark flex items-center justify-center text-white font-bold text-2xl">
                {candidate.personalInfo.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personality">Personality</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="team-fit">Team Fit</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-slate" />
                  <span>{candidate.personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-slate" />
                  <span>{candidate.personalInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-slate" />
                  <span>{candidate.personalInfo.location}</span>
                </div>
                {candidate.personalInfo.linkedinUrl && (
                  <div className="flex items-center gap-2 text-sm">
                    <Linkedin className="h-4 w-4 text-slate" />
                    <a href={candidate.personalInfo.linkedinUrl} className="text-glacier-dark hover:underline">
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                {candidate.personalInfo.portfolioUrl && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-slate" />
                    <a href={candidate.personalInfo.portfolioUrl} className="text-glacier-dark hover:underline">
                      Portfolio
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate">{candidate.personalInfo.bio}</p>
              </CardContent>
            </Card>

            {/* Top Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.slice(0, 10).map((skill, idx) => (
                    <Badge key={idx} variant={skill.verified ? 'default' : 'outline'} className={skill.verified ? 'bg-green-500' : ''}>
                      {skill.verified && <Star className="mr-1 h-3 w-3" />}
                      {skill.name} · {skill.level}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {candidate.education.map((edu, idx) => (
                  <div key={idx}>
                    <div className="font-semibold">{edu.degree} in {edu.field}</div>
                    <div className="text-sm text-slate">{edu.institution} · {edu.graduationYear}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personality" className="space-y-4">
            {/* MBTI */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">MBTI Type: {candidate.personality.mbti.type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Energy</div>
                    <div className="text-xs text-slate">
                      {candidate.personality.mbti.introversion_extraversion > 50 ? 'Extraverted' : 'Introverted'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Information</div>
                    <div className="text-xs text-slate">
                      {candidate.personality.mbti.intuition_sensing > 50 ? 'Intuitive' : 'Sensing'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Decisions</div>
                    <div className="text-xs text-slate">
                      {candidate.personality.mbti.thinking_feeling > 50 ? 'Thinking' : 'Feeling'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Structure</div>
                    <div className="text-xs text-slate">
                      {candidate.personality.mbti.judging_perceiving > 50 ? 'Judging' : 'Perceiving'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Big Five Radar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Big Five Personality Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={bigFiveData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="trait" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Score" dataKey="value" stroke="#5B8FCE" fill="#5B8FCE" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* DISC */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">DISC Work Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Dominance</span>
                    <span className="font-medium">{candidate.personality.disc.dominance}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${candidate.personality.disc.dominance}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Influence</span>
                    <span className="font-medium">{candidate.personality.disc.influence}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: `${candidate.personality.disc.influence}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Steadiness</span>
                    <span className="font-medium">{candidate.personality.disc.steadiness}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${candidate.personality.disc.steadiness}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Conscientiousness</span>
                    <span className="font-medium">{candidate.personality.disc.conscientiousness}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${candidate.personality.disc.conscientiousness}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            {/* Work Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {candidate.workExperience.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-glacier-dark pl-4">
                    <div className="font-semibold">{exp.position}</div>
                    <div className="text-sm text-slate mb-2">
                      {exp.company} · {exp.startDate.toLocaleDateString()} - {exp.endDate ? exp.endDate.toLocaleDateString() : 'Present'}
                    </div>
                    <p className="text-sm mb-2">{exp.description}</p>
                    {exp.achievements.length > 0 && (
                      <ul className="text-sm text-slate space-y-1">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 mt-0.5 text-glacier-dark flex-shrink-0" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Projects */}
            {candidate.projects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notable Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {candidate.projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="font-semibold mb-1">{project.title}</div>
                      <div className="text-sm text-slate mb-2">{project.role}</div>
                      <p className="text-sm mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, idx) => (
                          <Badge key={idx} variant="outline">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="team-fit" className="space-y-4">
            {team && teamMembers.length > 0 ? (
              <>
                {/* What-If Analysis Header */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-glacier-dark">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      What-If Team Analysis: Adding {candidate.personalInfo.name.split(' ')[0]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-graphite">{teamMembers.length}</div>
                        <div className="text-sm text-slate">Current Size</div>
                      </div>
                      <div>
                        <ArrowRight className="h-8 w-8 text-glacier-dark mx-auto" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-glacier-dark">{teamMembers.length + 1}</div>
                        <div className="text-sm text-slate">Projected Size</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Insights */}
                {insights.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Key Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {insights.map((insight, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                          {insight.type === 'positive' ? (
                            <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          )}
                          <span className="text-sm">{insight.text}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Team Personality Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Team Personality Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="trait" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="current" fill="#8AADDB" name="Current Team Avg" />
                        <Bar dataKey="projected" fill="#5B8FCE" name="With Candidate" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Detailed Changes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Detailed Trait Changes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {improvements && Object.entries(improvements).map(([trait, change]) => {
                      const displayTrait = trait === 'neuroticism' ? 'Emotional Stability' : trait;
                      const displayChange = trait === 'neuroticism' ? -change : change;
                      const absChange = Math.abs(displayChange);

                      return (
                        <div key={trait} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                          <span className="font-medium capitalize">{displayTrait}</span>
                          <div className="flex items-center gap-2">
                            {displayChange > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : displayChange < 0 ? (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            ) : (
                              <span className="text-slate">→</span>
                            )}
                            <span className={`font-semibold ${
                              displayChange > 0 ? 'text-green-600' : displayChange < 0 ? 'text-red-600' : 'text-slate'
                            }`}>
                              {displayChange > 0 ? '+' : ''}{absChange.toFixed(1)} pts
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Team Data Available</h3>
                  <p className="text-slate">Team fit analysis requires team information to be configured for this job.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
