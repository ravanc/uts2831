'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { PersonalityRadar } from '@/components/features/personality-radar';
import { mockEmployees } from '@/data';
import { getMBTIDescription, getBigFiveInsights, getDISCInsights } from '@/lib/personality';
import { EmployeeProfile, Recommendation } from '@/types';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Star,
  Calendar,
  TrendingUp,
  Brain,
  Users,
  Target,
  Sparkles,
  ClipboardList,
  UserPlus,
} from 'lucide-react';

export default function ProfilePage() {
  // Using the first employee as the current user's profile
  const [employee, setEmployee] = useState<EmployeeProfile>(mockEmployees[0]);
  const [customReferences, setCustomReferences] = useState<Recommendation[]>([]);

  useEffect(() => {
    // Load personality profile from localStorage if available
    const storedProfile = localStorage.getItem('userPersonalityProfile');
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      setEmployee(prev => ({
        ...prev,
        personality: {
          ...prev.personality,
          ...(parsedProfile.bigFive && { bigFive: parsedProfile.bigFive }),
          ...(parsedProfile.mbti && { mbti: parsedProfile.mbti }),
          ...(parsedProfile.disc && { disc: parsedProfile.disc }),
        },
      }));
    }

    // Load references from localStorage
    const storedReferences = localStorage.getItem('references');
    if (storedReferences) {
      const parsedReferences = JSON.parse(storedReferences);
      // Convert to Recommendation format
      const recommendations: Recommendation[] = parsedReferences.map((ref: any) => ({
        id: ref.id,
        recommenderId: ref.id,
        recommenderName: ref.refereeName,
        recommenderPosition: ref.refereePosition,
        recommenderCompany: ref.refereeCompany,
        relationship: ref.relationship,
        text: ref.text,
        date: new Date(ref.date),
        verified: ref.verified,
      }));
      setCustomReferences(recommendations);
    }
  }, []);

  const mbtiInfo = getMBTIDescription(employee.personality.mbti.type);
  const bigFiveInsights = getBigFiveInsights(employee.personality.bigFive);
  const discInsights = getDISCInsights(employee.personality.disc);

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'bg-purple-500';
      case 'advanced':
        return 'bg-blue-500';
      case 'intermediate':
        return 'bg-green-500';
      case 'beginner':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-32 w-32">
                <AvatarImage src={employee.personalInfo.avatarUrl} />
                <AvatarFallback>{employee.personalInfo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{employee.personalInfo.name}</h1>
                    <p className="text-xl text-gray-600 mb-2">{employee.personalInfo.title}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {employee.personalInfo.location}
                      </Badge>
                      <Badge
                        className={
                          employee.availability.status === 'actively_looking'
                            ? 'bg-green-500'
                            : employee.availability.status === 'open_to_opportunities'
                            ? 'bg-blue-500'
                            : 'bg-gray-500'
                        }
                      >
                        {employee.availability.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link href="/jobs">
                      <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                        <Sparkles className="mr-2 h-5 w-5" />
                        Find where I'll thrive
                      </Button>
                    </Link>
                    <div className="flex gap-2">
                      <Link href="/assessments" className="flex-1">
                        <Button variant="outline" className="w-full">
                          <ClipboardList className="mr-2 h-4 w-4" />
                          Assessments
                        </Button>
                      </Link>
                      <Link href="/references" className="flex-1">
                        <Button variant="outline" className="w-full">
                          <UserPlus className="mr-2 h-4 w-4" />
                          References
                        </Button>
                      </Link>
                    </div>
                    <Button variant="outline">Edit Profile</Button>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{employee.personalInfo.bio}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <a href={`mailto:${employee.personalInfo.email}`} className="flex items-center gap-1 hover:text-blue-600">
                    <Mail className="h-4 w-4" />
                    {employee.personalInfo.email}
                  </a>
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {employee.personalInfo.phone}
                  </span>
                  {employee.personalInfo.linkedinUrl && (
                    <a href={employee.personalInfo.linkedinUrl} className="flex items-center gap-1 hover:text-blue-600">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                  {employee.personalInfo.portfolioUrl && (
                    <a href={employee.personalInfo.portfolioUrl} className="flex items-center gap-1 hover:text-blue-600">
                      <Globe className="h-4 w-4" />
                      Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="skills">
              <Target className="mr-2 h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="projects">
              <TrendingUp className="mr-2 h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="experience">
              <Briefcase className="mr-2 h-4 w-4" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="mr-2 h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="personality">
              <Brain className="mr-2 h-4 w-4" />
              Personality
            </TabsTrigger>
          </TabsList>

          {/* Personality Tab */}
          <TabsContent value="personality" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Big Five */}
              <Card>
                <CardHeader>
                  <CardTitle>Big Five Personality Traits</CardTitle>
                  <CardDescription>
                    OCEAN model - scientifically validated personality framework
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PersonalityRadar traits={employee.personality.bigFive} />
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold">Insights:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {bigFiveInsights.map((insight, idx) => (
                        <li key={idx}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* MBTI */}
              <Card>
                <CardHeader>
                  <CardTitle>Myers-Briggs Type Indicator</CardTitle>
                  <CardDescription>
                    Understanding preferences and work style
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg px-8 py-4">
                      <div className="text-5xl font-bold mb-2">{employee.personality.mbti.type}</div>
                      <div className="text-lg">{mbtiInfo.title}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{mbtiInfo.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2">Key Strengths:</h4>
                    <div className="flex flex-wrap gap-2">
                      {mbtiInfo.strengths.map((strength, idx) => (
                        <Badge key={idx} variant="outline">{strength}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* DISC */}
              <Card>
                <CardHeader>
                  <CardTitle>DISC Work Style</CardTitle>
                  <CardDescription>
                    Understanding work behavior and communication style
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Dominance</span>
                        <span className="text-sm text-gray-600">{employee.personality.disc.dominance}%</span>
                      </div>
                      <Progress value={employee.personality.disc.dominance} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Influence</span>
                        <span className="text-sm text-gray-600">{employee.personality.disc.influence}%</span>
                      </div>
                      <Progress value={employee.personality.disc.influence} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Steadiness</span>
                        <span className="text-sm text-gray-600">{employee.personality.disc.steadiness}%</span>
                      </div>
                      <Progress value={employee.personality.disc.steadiness} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Conscientiousness</span>
                        <span className="text-sm text-gray-600">{employee.personality.disc.conscientiousness}%</span>
                      </div>
                      <Progress value={employee.personality.disc.conscientiousness} className="h-2" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold">Work Style Insights:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {discInsights.map((insight, idx) => (
                        <li key={idx}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Interests */}
              <Card>
                <CardHeader>
                  <CardTitle>Interests & Passions</CardTitle>
                  <CardDescription>
                    Topics and areas of enthusiasm
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {employee.interests.map((interest, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{interest.category}</span>
                        <Badge>{interest.intensity}% intensity</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {interest.topics.map((topic, topicIdx) => (
                          <Badge key={topicIdx} variant="outline">{topic}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Technical Skills</CardTitle>
                <CardDescription>
                  Verified and self-reported skills with proficiency levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {employee.skills.map((skill, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{skill.name}</h4>
                        {skill.verified && (
                          <Badge variant="outline" className="bg-green-50">
                            <Award className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getSkillLevelColor(skill.level)}>
                            {skill.level}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {skill.yearsOfExperience} years
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {employee.workExperience.map((exp, idx) => (
                  <div key={exp.id}>
                    {idx > 0 && <Separator className="my-6" />}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {exp.company.substring(0, 2)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{exp.position}</h3>
                        <p className="text-gray-600 mb-2">{exp.company}</p>
                        <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {exp.startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                          {exp.endDate ? exp.endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                        </p>
                        <p className="text-gray-700 mb-3">{exp.description}</p>
                        <div className="mb-3">
                          <h4 className="font-semibold text-sm mb-2">Key Achievements:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                            {exp.achievements.map((achievement, achIdx) => (
                              <li key={achIdx}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill, skillIdx) => (
                            <Badge key={skillIdx} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {employee.education.map((edu, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <GraduationCap className="h-10 w-10 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">
                        {edu.field} • Class of {edu.graduationYear}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <div className="grid gap-6 md:grid-cols-2">
              {employee.projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{project.description}</p>
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2">Technologies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, idx) => (
                          <Badge key={idx} variant="outline">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2">Key Achievements:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {project.achievements.map((achievement, idx) => (
                          <li key={idx}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-sm text-gray-500">
                      {project.startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                      {project.endDate ? project.endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Ongoing'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reviews & Recommendations</CardTitle>
                <CardDescription>
                  Feedback from colleagues, managers, and clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {employee.reviews.map((review) => (
                  <div key={review.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{review.reviewerName}</h4>
                        <p className="text-sm text-gray-600">
                          {review.reviewerPosition} at {review.reviewerCompany}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            className={`h-4 w-4 ${
                              idx < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {review.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">
                      {review.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      {review.verified && ' • Verified'}
                    </p>
                  </div>
                ))}

                {[...employee.recommendations, ...customReferences].map((rec) => (
                  <div key={rec.id} className="border-l-4 border-purple-500 pl-4">
                    <div className="mb-2">
                      <h4 className="font-semibold">{rec.recommenderName}</h4>
                      <p className="text-sm text-gray-600">
                        {rec.recommenderPosition} at {rec.recommenderCompany} • {rec.relationship}
                      </p>
                    </div>
                    <p className="text-gray-700 mb-2">{rec.text}</p>
                    <p className="text-sm text-gray-500">
                      {rec.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      {rec.verified && ' • Verified'}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
