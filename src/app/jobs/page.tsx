'use client';

import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { mockJobs, mockEmployees, mockCompanies } from '@/data';
import { calculatePersonalityMatch } from '@/lib/personality';
import { generatePlainEnglishReasons } from '@/lib/plain-english-matching';
import { useApplications } from '@/lib/application-context';
import { useNotifications } from '@/components/notifications';
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
  Send,
} from 'lucide-react';

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [selectedJobForApplication, setSelectedJobForApplication] = useState<{ job: Job; matchScore: number } | null>(null);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<{ job: Job; matchScore: number } | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Using first employee as the logged-in user
  const currentEmployee = mockEmployees[0];

  // Application management
  const { submitApplication, hasApplied } = useApplications();
  const { showNotification } = useNotifications();

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

  const handleApplyClick = (job: Job, matchScore: number) => {
    setSelectedJobForApplication({ job, matchScore });
    setCoverLetter('');
  };

  const handleSubmitApplication = async () => {
    if (!selectedJobForApplication) return;

    setIsSubmitting(true);

    // Simulate a short delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      submitApplication(
        selectedJobForApplication.job.id,
        currentEmployee.id,
        selectedJobForApplication.matchScore,
        coverLetter || undefined
      );

      const company = mockCompanies.find(c => c.id === selectedJobForApplication.job.companyId);

      showNotification(
        'Application Submitted!',
        `Your application for ${selectedJobForApplication.job.title} at ${company?.name} has been submitted successfully.`,
        'success'
      );

      setSelectedJobForApplication(null);
      setCoverLetter('');
    } catch (error) {
      showNotification(
        'Application Failed',
        'There was an error submitting your application. Please try again.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    if (!isSubmitting) {
      setSelectedJobForApplication(null);
      setCoverLetter('');
    }
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
                      <span className="text-sm text-gray-500" suppressHydrationWarning>
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
                      <ul className="space-y-4">
                        {matchData.reasoning.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <div className="text-graphite font-semibold text-base">{reason.point}</div>
                              <div className="text-slate text-sm mt-0.5">{reason.evidence}</div>
                            </div>
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
                    {hasApplied(job.id, currentEmployee.id) ? (
                      <Button className="flex-1" disabled>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Applied
                      </Button>
                    ) : (
                      <Button
                        className="flex-1"
                        onClick={() => handleApplyClick(job, matchData.overallScore)}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Apply Now
                      </Button>
                    )}
                    <Button variant="outline">Save Job</Button>
                    <Button variant="outline" onClick={() => setSelectedJobForDetails({ job, matchScore: matchData.overallScore })}>
                      View Details
                    </Button>
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

      {/* Application Dialog */}
      <Dialog open={!!selectedJobForApplication} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJobForApplication?.job.title}</DialogTitle>
            <DialogDescription>
              {selectedJobForApplication && (
                <>
                  {mockCompanies.find(c => c.id === selectedJobForApplication.job.companyId)?.name} •{' '}
                  {selectedJobForApplication.job.location}
                  <br />
                  <span className="text-glacier-dark font-semibold">
                    {selectedJobForApplication.matchScore}% Match
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="coverLetter">
                Cover Letter <span className="text-slate text-sm">(Optional)</span>
              </Label>
              <Textarea
                id="coverLetter"
                placeholder="Tell the employer why you're interested in this position and what makes you a great fit..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={8}
                disabled={isSubmitting}
              />
            </div>
            <div className="bg-mist-blue/30 border border-mist-blue rounded-lg p-4">
              <p className="text-sm text-slate">
                <strong className="text-graphite">Your application includes:</strong> Your profile, personality
                assessment, skills, work experience, projects, and recommendations.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmitApplication} disabled={isSubmitting}>
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Job Details Dialog */}
      <Dialog open={!!selectedJobForDetails} onOpenChange={(open) => !open && setSelectedJobForDetails(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {selectedJobForDetails && (() => {
            const job = selectedJobForDetails.job;
            const company = mockCompanies.find(c => c.id === job.companyId);

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{job.title}</DialogTitle>
                  <DialogDescription>
                    {company?.name}
                  </DialogDescription>
                </DialogHeader>

                {/* Job metadata outside DialogDescription to avoid nesting issues */}
                <div className="flex flex-col gap-2 -mt-2">
                  <div className="flex items-center gap-4 flex-wrap text-sm text-slate">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <Badge variant="outline">{job.type}</Badge>
                    <Badge variant="outline">{job.remotePolicy}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-slate" />
                    <span className="font-semibold text-graphite">
                      ${(job.salaryRange.min / 1000).toFixed(0)}k - ${(job.salaryRange.max / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <Badge className={`w-fit text-base px-3 py-1 ${getMatchColor(selectedJobForDetails.matchScore)}`}>
                    {selectedJobForDetails.matchScore}% {getMatchLabel(selectedJobForDetails.matchScore)}
                  </Badge>
                </div>

                <div className="space-y-6 py-4">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-graphite mb-2">About the Role</h3>
                    <p className="text-slate">{job.description}</p>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <h3 className="text-lg font-semibold text-graphite mb-3">Responsibilities</h3>
                    <ul className="space-y-2">
                      {job.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-glacier-dark flex-shrink-0 mt-0.5" />
                          <span className="text-slate">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h3 className="text-lg font-semibold text-graphite mb-3">Requirements</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-graphite">Required</h4>
                        <ul className="space-y-1">
                          {job.requirements.required.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-glacier-dark mt-1">•</span>
                              <span className="text-slate text-sm">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-graphite">Preferred</h4>
                        <ul className="space-y-1">
                          {job.requirements.preferred.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-glacier-dark mt-1">•</span>
                              <span className="text-slate text-sm">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-lg font-semibold text-graphite mb-3">Skills</h3>
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Required</h4>
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
                      {job.skills.filter(s => !s.required).length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Nice to Have</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.filter(s => !s.required).map((skill, idx) => {
                              const hasSkill = currentEmployee.skills.some(s => s.name === skill.name);
                              return (
                                <Badge
                                  key={idx}
                                  variant={hasSkill ? 'default' : 'secondary'}
                                  className={hasSkill ? 'bg-blue-500' : ''}
                                >
                                  {hasSkill && <CheckCircle2 className="mr-1 h-3 w-3" />}
                                  {skill.name}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h3 className="text-lg font-semibold text-graphite mb-3">Benefits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {job.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-slate text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Company Info */}
                  {company && (
                    <div className="bg-gradient-to-r from-glacier/20 to-lavender/20 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-graphite mb-2">About {company.name}</h3>
                      <p className="text-slate text-sm">{company.description}</p>
                    </div>
                  )}
                </div>

                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setSelectedJobForDetails(null)}>
                    Close
                  </Button>
                  {hasApplied(job.id, currentEmployee.id) ? (
                    <Button disabled>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Applied
                    </Button>
                  ) : (
                    <Button onClick={() => {
                      setSelectedJobForDetails(null);
                      handleApplyClick(job, selectedJobForDetails.matchScore);
                    }}>
                      <Send className="mr-2 h-4 w-4" />
                      Apply Now
                    </Button>
                  )}
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
