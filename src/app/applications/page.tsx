'use client';

import { useState, useMemo, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CandidateProfileModal } from '@/components/applications/candidate-profile-modal';
import { useApplications } from '@/lib/application-context';
import { useNotifications } from '@/components/notifications';
import { useAuth } from '@/lib/auth-context';
import { mockJobs, mockEmployees, mockCompanies } from '@/data';
import { ApplicationStatus, EmployeeProfile, Job, Team } from '@/types';
import {
  Briefcase,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  TrendingUp,
  FileText,
  Calendar,
  MapPin,
  DollarSign,
  Building,
} from 'lucide-react';

export default function ApplicationsPage() {
  const { user } = useAuth();
  const { applications, updateApplicationStatus, markApplicationsAsViewed } = useApplications();
  const { showNotification } = useNotifications();
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>('all');
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<{
    employee: EmployeeProfile;
    job: Job;
    matchScore: number;
    team?: Team | null;
    teamMembers?: EmployeeProfile[];
  } | null>(null);

  // Mark applications as viewed when employer opens this page
  useEffect(() => {
    if (user?.role === 'employer' || user?.role === 'executive') {
      markApplicationsAsViewed();
    }
  }, [markApplicationsAsViewed, user?.role]);

  // Get current employee's ID if they are an employee
  const currentEmployeeId = useMemo(() => {
    if (user?.role === 'employee') {
      return mockEmployees[0]?.id; // In a real app, this would be from authenticated user
    }
    return null;
  }, [user?.role]);

  // Filter applications based on role
  const roleFilteredApplications = useMemo(() => {
    if (user?.role === 'employee' && currentEmployeeId) {
      return applications.filter(app => app.employeeId === currentEmployeeId);
    }
    return applications;
  }, [applications, user?.role, currentEmployeeId]);

  // Get unique jobs that have applications
  const jobsWithApplications = useMemo(() => {
    const jobIds = new Set(roleFilteredApplications.map(app => app.jobId));
    return mockJobs.filter(job => jobIds.has(job.id));
  }, [roleFilteredApplications]);

  // Filter applications
  const filteredApplications = useMemo(() => {
    return roleFilteredApplications.filter(app => {
      if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;
      if (selectedJob !== 'all' && app.jobId !== selectedJob) return false;
      return true;
    });
  }, [roleFilteredApplications, selectedStatus, selectedJob]);

  // Group applications by job
  const applicationsByJob = useMemo(() => {
    const grouped = new Map<string, typeof filteredApplications>();
    filteredApplications.forEach(app => {
      const existing = grouped.get(app.jobId) || [];
      grouped.set(app.jobId, [...existing, app]);
    });
    return grouped;
  }, [filteredApplications]);

  const handleStatusChange = (applicationId: string, newStatus: ApplicationStatus) => {
    updateApplicationStatus(applicationId, newStatus);
    showNotification(
      'Status Updated',
      `Application status updated to ${newStatus}`,
      'success'
    );
  };

  const handleViewProfile = (employee: EmployeeProfile, job: Job, matchScore: number) => {
    // Find the company and team for this job
    const company = mockCompanies.find(c => c.id === job.companyId);
    const team = company?.teams.find(t => t.id === job.teamId);

    // Get team members if team exists
    let teamMembers: EmployeeProfile[] = [];
    if (team) {
      teamMembers = team.members
        .map(tm => mockEmployees.find(e => e.id === tm.employeeId))
        .filter((e): e is EmployeeProfile => e !== undefined);
    }

    setSelectedCandidate({
      employee,
      job,
      matchScore,
      team: team || null,
      teamMembers,
    });
    setProfileModalOpen(true);
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800';
      case 'interviewing':
        return 'bg-purple-100 text-purple-800';
      case 'offer':
        return 'bg-green-100 text-green-800';
      case 'accepted':
        return 'bg-green-600 text-white';
      case 'rejected':
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'applied':
        return <FileText className="h-4 w-4" />;
      case 'reviewing':
        return <AlertCircle className="h-4 w-4" />;
      case 'interviewing':
        return <Phone className="h-4 w-4" />;
      case 'offer':
        return <TrendingUp className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getApplicationStats = () => {
    return {
      total: roleFilteredApplications.length,
      applied: roleFilteredApplications.filter(a => a.status === 'applied').length,
      reviewing: roleFilteredApplications.filter(a => a.status === 'reviewing').length,
      interviewing: roleFilteredApplications.filter(a => a.status === 'interviewing').length,
      offer: roleFilteredApplications.filter(a => a.status === 'offer').length,
    };
  };

  const stats = getApplicationStats();
  const isEmployee = user?.role === 'employee';

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-graphite mb-2">
            {isEmployee ? 'My Applications' : 'Applications'}
          </h1>
          <p className="text-xl text-slate">
            {isEmployee
              ? 'Track the status of your job applications'
              : 'Manage and review job applications'
            }
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-graphite">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate">Applied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.applied}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate">Reviewing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.reviewing}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate">Interviewing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.interviewing}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate">Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.offer}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Job</label>
                <Select value={selectedJob} onValueChange={setSelectedJob}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Jobs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    {jobsWithApplications.map(job => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Status</label>
                <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as ApplicationStatus | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        {roleFilteredApplications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
              <p className="text-slate">
                {isEmployee
                  ? 'Start applying to jobs to see your applications here'
                  : 'Applications will appear here when candidates apply to your jobs'
                }
              </p>
            </CardContent>
          </Card>
        ) : filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No applications match your filters</h3>
              <p className="text-slate">Try adjusting your filter criteria</p>
            </CardContent>
          </Card>
        ) : isEmployee ? (
          // Employee View: Show job details prominently
          <div className="space-y-6">
            {filteredApplications.map(application => {
              const job = mockJobs.find(j => j.id === application.jobId);
              const company = mockCompanies.find(c => c.id === job?.companyId);
              if (!job) return null;

              return (
                <Card key={application.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                        <CardDescription className="text-base">
                          <div className="flex items-center gap-4 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {company?.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              ${(job.salaryRange.min / 1000).toFixed(0)}k - ${(job.salaryRange.max / 1000).toFixed(0)}k
                            </span>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(application.status)}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </Badge>
                        <span className="text-sm text-slate flex items-center gap-1" suppressHydrationWarning>
                          <Clock className="h-3 w-3" />
                          Applied {new Date(application.appliedDate).toLocaleDateString()}
                        </span>
                        <span className="text-glacier-dark font-semibold">
                          {application.matchScore}% Match
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Job Description */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Job Description</h4>
                        <p className="text-sm text-slate">{job.description}</p>
                      </div>

                      {/* Required Skills */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Required Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.filter(s => s.required).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="bg-mist-blue">
                              {skill.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Cover Letter */}
                      {application.coverLetter && (
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-semibold text-sm mb-2">Your Cover Letter</h4>
                          <p className="text-sm text-slate whitespace-pre-wrap">{application.coverLetter}</p>
                        </div>
                      )}

                      {/* Benefits */}
                      {job.benefits && job.benefits.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Benefits</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.benefits.slice(0, 4).map((benefit, idx) => (
                              <Badge key={idx} variant="secondary">{benefit}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 pt-2">
                        <Button variant="outline" asChild>
                          <a href={`/jobs#${job.id}`}>View Job Details</a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          // Employer View: Show candidates by job
          <div className="space-y-8">
            {Array.from(applicationsByJob.entries()).map(([jobId, jobApplications]) => {
              const job = mockJobs.find(j => j.id === jobId);
              const company = mockCompanies.find(c => c.id === job?.companyId);

              return (
                <div key={jobId}>
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-graphite">{job?.title}</h2>
                    <p className="text-slate">{company?.name} • {job?.location}</p>
                    <Badge variant="outline" className="mt-2">
                      {jobApplications.length} Application{jobApplications.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {jobApplications.map(application => {
                      const employee = mockEmployees.find(e => e.id === application.employeeId);
                      if (!employee) return null;

                      return (
                        <Card key={application.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-glacier-dark to-lavender-dark flex items-center justify-center text-white font-bold text-xl">
                                    {employee.personalInfo.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                </div>
                                <div>
                                  <CardTitle className="text-xl mb-1">{employee.personalInfo.name}</CardTitle>
                                  <CardDescription>
                                    {employee.personalInfo.title}
                                    <br />
                                    <span className="text-glacier-dark font-semibold">
                                      {application.matchScore}% Match
                                    </span>
                                  </CardDescription>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge className={getStatusColor(application.status)}>
                                  {getStatusIcon(application.status)}
                                  <span className="ml-1 capitalize">{application.status}</span>
                                </Badge>
                                <span className="text-sm text-slate flex items-center gap-1" suppressHydrationWarning>
                                  <Clock className="h-3 w-3" />
                                  {new Date(application.appliedDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {application.coverLetter && (
                              <div className="mb-4 p-4 bg-muted rounded-lg">
                                <h4 className="font-semibold text-sm mb-2">Cover Letter</h4>
                                <p className="text-sm text-slate whitespace-pre-wrap">{application.coverLetter}</p>
                              </div>
                            )}

                            <div className="mb-4">
                              <h4 className="font-semibold text-sm mb-2">Top Skills</h4>
                              <div className="flex flex-wrap gap-2">
                                {employee.skills.slice(0, 5).map((skill, idx) => (
                                  <Badge key={idx} variant="outline">{skill.name}</Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <Select
                                value={application.status}
                                onValueChange={(value) => handleStatusChange(application.id, value as ApplicationStatus)}
                              >
                                <SelectTrigger className="w-[200px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="applied">Applied</SelectItem>
                                  <SelectItem value="reviewing">Reviewing</SelectItem>
                                  <SelectItem value="interviewing">Interviewing</SelectItem>
                                  <SelectItem value="offer">Offer</SelectItem>
                                  <SelectItem value="accepted">Accepted</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                onClick={() => job && handleViewProfile(employee, job, application.matchScore)}
                              >
                                View Full Profile
                              </Button>
                              <Button variant="outline">Schedule Interview</Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Candidate Profile Modal */}
      <CandidateProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        candidate={selectedCandidate?.employee || null}
        job={selectedCandidate?.job || null}
        matchScore={selectedCandidate?.matchScore || 0}
        team={selectedCandidate?.team}
        teamMembers={selectedCandidate?.teamMembers}
      />
    </MainLayout>
  );
}
