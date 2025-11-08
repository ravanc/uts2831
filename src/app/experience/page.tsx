'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockEmployees } from '@/data';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  TrendingUp,
  Award,
  Users,
  Briefcase,
  Star,
  Calendar,
  Target,
  Sparkles,
} from 'lucide-react';

export default function ExperiencePage() {
  // Using first employee as the logged-in user
  const employee = mockEmployees[0];

  // Generate job satisfaction over time data
  const satisfactionData = [
    { year: '2018', satisfaction: 75, label: 'StartupXYZ - Early Days' },
    { year: '2019', satisfaction: 82, label: 'StartupXYZ - Growth' },
    { year: '2020', satisfaction: 88, label: 'StartupXYZ - Peak' },
    { year: '2021', satisfaction: 85, label: 'Transition to TechCorp' },
    { year: '2022', satisfaction: 90, label: 'TechCorp - Thriving' },
    { year: '2023', satisfaction: 92, label: 'TechCorp - Leadership Role' },
    { year: '2024', satisfaction: 94, label: 'TechCorp - Current' },
  ];

  // Best teams data
  const bestTeams = [
    {
      name: 'Platform Engineering',
      company: 'TechCorp Inc.',
      period: '2021-Present',
      satisfaction: 94,
      highlights: [
        'Excellent team culture',
        'Great technical challenges',
        'Strong mentorship opportunities',
      ],
    },
    {
      name: 'Core Product Team',
      company: 'StartupXYZ',
      period: '2019-2021',
      satisfaction: 88,
      highlights: [
        'Fast-paced innovation',
        'High autonomy',
        'Direct impact on product',
      ],
    },
  ];

  // Career growth metrics
  const careerGrowth = [
    { metric: 'Technical Skills', growth: 85, max: 100 },
    { metric: 'Leadership', growth: 75, max: 100 },
    { metric: 'Impact', growth: 90, max: 100 },
    { metric: 'Work-Life Balance', growth: 80, max: 100 },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Career Journey</h1>
          <p className="text-xl text-gray-600">
            Insights into your professional growth, satisfaction, and best experiences
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Career Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-green-600">94%</span>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Current rating</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Years of Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-600">
                  {employee.workExperience.length > 0
                    ? new Date().getFullYear() -
                      employee.workExperience[employee.workExperience.length - 1].startDate.getFullYear()
                    : 0}
                </span>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Total years</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Projects Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-purple-600">
                  {employee.projects.length}+
                </span>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Major projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-yellow-600">
                  {(
                    employee.reviews.reduce((sum, r) => sum + r.rating, 0) /
                    employee.reviews.length
                  ).toFixed(1)}
                </span>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">From {employee.reviews.length} reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Satisfaction Over Time */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Job Satisfaction Over Time</CardTitle>
            <CardDescription>
              Track your happiness and fulfillment throughout your career
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-semibold">{payload[0].payload.label}</p>
                          <p className="text-sm text-gray-600">
                            Satisfaction: {payload[0].value}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="satisfaction"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Strong upward trajectory</p>
                  <p className="text-sm text-green-700">
                    Your satisfaction has increased by 25% since starting your career, with
                    particularly strong growth at TechCorp Inc.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Teams */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              Your Best Teams
            </CardTitle>
            <CardDescription>
              Teams where you thrived and made the greatest impact
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bestTeams.map((team, idx) => (
              <div
                key={idx}
                className="p-4 border-2 border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{team.name}</h3>
                    <p className="text-gray-600">{team.company}</p>
                    <p className="text-sm text-gray-500">{team.period}</p>
                  </div>
                  <Badge className="bg-green-500 text-lg px-3 py-1">
                    {team.satisfaction}% Satisfaction
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Why this team worked:</p>
                  <ul className="space-y-1">
                    {team.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2 text-sm text-gray-600">
                        <Sparkles className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Best Projects */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-yellow-600" />
              Standout Projects
            </CardTitle>
            <CardDescription>
              Projects that showcased your best work and had significant impact
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {employee.projects.map((project) => (
              <div key={project.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.role}</p>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    Featured
                  </Badge>
                </div>
                <p className="text-gray-700 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="outline">{tech}</Badge>
                  ))}
                </div>
                <div className="border-t pt-3 mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Key Achievements:</p>
                  <ul className="space-y-1">
                    {project.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Career Growth Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Career Growth Metrics</CardTitle>
            <CardDescription>
              Holistic view of your professional development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={careerGrowth} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="metric" width={150} />
                <Tooltip />
                <Bar dataKey="growth" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-purple-900">Well-rounded growth</p>
                  <p className="text-sm text-purple-700">
                    You've shown strong development across all key areas, with particularly
                    impressive technical skills and impact metrics.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
