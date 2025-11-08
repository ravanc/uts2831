'use client';

import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockJobs, mockEmployees, mockCompanies } from '@/data';
import { calculatePersonalityMatch } from '@/lib/personality';
import { generatePlainEnglishReasons } from '@/lib/plain-english-matching';
import { Job, JobMatch } from '@/types';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  TrendingUp,
  Search,
  Building2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match');

  // Using first employee as the logged-in user
  const currentEmployee = mockEmployees[0];

  // Calculate matches for all jobs
  const jobMatches = useMemo<JobMatch[]>(() => {
    return mockJobs.map((job) => {
      const personalityMatch = calculatePersonalityMatch(
        currentEmployee.personality,
        job.idealPersonality
      );

      // Calculate skills match
      const requiredSkills = job.skills.filter(s => s.required).map(s => s.name);
      const employeeSkillNames = currentEmployee.skills.map(s => s.name);
      const matchedSkills = requiredSkills.filter(skill => employeeSkillNames.includes(skill));
      const skillsMatch = requiredSkills.length > 0
        ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
        : 50;

      // Calculate interests match (simplified)
      const interestsMatch = 70 + Math.floor(Math.random() * 20);

      // Calculate preferences match
      let preferencesMatch = 50;
      if (currentEmployee.preferences.remoteWork && job.remotePolicy === 'remote') {
        preferencesMatch += 25;
      }
      if (currentEmployee.preferences.preferredRoles.some(role =>
        job.title.toLowerCase().includes(role.toLowerCase())
      )) {
        preferencesMatch += 25;
      }

      // Overall score is weighted average
      const overallScore = Math.round(
        personalityMatch.score * 0.35 +
        skillsMatch * 0.35 +
        interestsMatch * 0.15 +
        preferencesMatch * 0.15
      );

      // Generate plain-English reasons
      const reasoning = generatePlainEnglishReasons(currentEmployee, job);

      return {
        jobId: job.id,
        overallScore,
        personalityMatch,
        skillsMatch,
        interestsMatch,
        preferencesMatch,
        reasoning,
      };
    });
  }, [currentEmployee]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let filtered = mockJobs.filter((job, idx) => {
      const matchData = jobMatches[idx];
      const company = mockCompanies.find(c => c.id === job.companyId);

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          company?.name.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (locationFilter !== 'all' && job.location !== locationFilter) {
        return false;
      }

      if (typeFilter !== 'all' && job.type !== typeFilter) {
        return false;
      }

      return true;
    });

    // Sort jobs
    const sortedIndices = filtered.map((job) => mockJobs.indexOf(job));
    const sortedJobs = filtered.map((job, idx) => {
      const matchData = jobMatches[sortedIndices[idx]];
      return { job, matchData };
    });

    if (sortBy === 'match') {
      sortedJobs.sort((a, b) => b.matchData.overallScore - a.matchData.overallScore);
    } else if (sortBy === 'recent') {
      sortedJobs.sort((a, b) => b.job.postedDate.getTime() - a.job.postedDate.getTime());
    }

    return sortedJobs;
  }, [searchQuery, locationFilter, typeFilter, sortBy, jobMatches]);

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Low Match';
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Job Board</h1>
          <p className="text-xl text-gray-600">
            Find jobs matched to your personality, skills, and preferences
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs, companies..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
                  <SelectItem value="Austin, TX">Austin, TX</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="Seattle, WA">Seattle, WA</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} matching your criteria
          </p>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map(({ job, matchData }) => {
            const company = mockCompanies.find(c => c.id === job.companyId);
            const daysAgo = Math.floor((Date.now() - job.postedDate.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                          {company?.name.substring(0, 2) || 'CO'}
                        </div>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-1">{job.title}</CardTitle>
                        <CardDescription className="flex flex-col gap-1">
                          <span className="flex items-center gap-1 text-base">
                            <Building2 className="h-4 w-4" />
                            {company?.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location} • {job.remotePolicy}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`text-lg px-4 py-2 ${getMatchColor(matchData.overallScore)}`}>
                        {matchData.overallScore}% {getMatchLabel(matchData.overallScore)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        <Clock className="inline h-3 w-3 mr-1" />
                        Posted {daysAgo} days ago
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{job.description}</p>

                  {/* Why You'll Thrive */}
                  <div className="mb-4 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      Why You'll Thrive Here
                    </h4>
                    {matchData.reasoning.length > 0 ? (
                      <ul className="space-y-3">
                        {matchData.reasoning.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-900 font-medium">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">Great potential match based on your experience</p>
                    )}
                  </div>

                  {/* Job Details */}
                  <div className="grid gap-4 md:grid-cols-3 mb-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Salary Range</h4>
                      <p className="text-gray-700 flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Job Type</h4>
                      <Badge variant="outline">{job.type}</Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Department</h4>
                      <p className="text-gray-700">{job.department}</p>
                    </div>
                  </div>

                  {/* Required Skills */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.filter(s => s.required).map((skill, idx) => {
                        const hasSkill = currentEmployee.skills.some(s => s.name === skill.name);
                        return (
                          <Badge
                            key={idx}
                            variant={hasSkill ? 'default' : 'outline'}
                            className={hasSkill ? 'bg-green-500' : ''}
                          >
                            {hasSkill && <CheckCircle2 className="mr-1 h-3 w-3" />}
                            {skill.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button className="flex-1">Apply Now</Button>
                    <Button variant="outline">Save Job</Button>
                    <Button variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredJobs.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
