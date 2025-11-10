'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { JobApplication, ApplicationStatus, ApplicationStatusHistoryEntry } from '@/types';

interface ApplicationContextType {
  applications: JobApplication[];
  submitApplication: (jobId: string, employeeId: string, matchScore: number, coverLetter?: string) => void;
  updateApplicationStatus: (applicationId: string, newStatus: ApplicationStatus, note?: string) => void;
  getApplicationsByJob: (jobId: string) => JobApplication[];
  getApplicationsByEmployee: (employeeId: string) => JobApplication[];
  getApplicationById: (applicationId: string) => JobApplication | undefined;
  hasApplied: (jobId: string, employeeId: string) => boolean;
  getNewApplicationsCount: (since?: Date) => number;
  markApplicationsAsViewed: () => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

const STORAGE_KEY = 'crewfit_applications';
const LAST_VIEWED_KEY = 'crewfit_applications_last_viewed';

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [lastViewed, setLastViewed] = useState<Date>(new Date());

  // Load applications from localStorage on mount
  useEffect(() => {
    const loadApplications = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        const lastViewedStored = localStorage.getItem(LAST_VIEWED_KEY);

        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            // Convert date strings back to Date objects
            const appsWithDates = parsed.map((app: any) => ({
              ...app,
              appliedDate: new Date(app.appliedDate),
              lastUpdated: new Date(app.lastUpdated),
              statusHistory: app.statusHistory.map((entry: any) => ({
                ...entry,
                timestamp: new Date(entry.timestamp),
              })),
            }));
            setApplications(appsWithDates);
          } catch (error) {
            console.error('Failed to parse applications from localStorage:', error);
          }
        }

        if (lastViewedStored) {
          try {
            setLastViewed(new Date(lastViewedStored));
          } catch (error) {
            console.error('Failed to parse last viewed timestamp:', error);
          }
        }
      }
    };

    loadApplications();
  }, []);

  // Save applications to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && applications.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    }
  }, [applications]);

  // Listen for storage events (cross-tab/window sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const appsWithDates = parsed.map((app: any) => ({
            ...app,
            appliedDate: new Date(app.appliedDate),
            lastUpdated: new Date(app.lastUpdated),
            statusHistory: app.statusHistory.map((entry: any) => ({
              ...entry,
              timestamp: new Date(entry.timestamp),
            })),
          }));
          setApplications(appsWithDates);
        } catch (error) {
          console.error('Failed to parse applications from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const submitApplication = useCallback(
    (jobId: string, employeeId: string, matchScore: number, coverLetter?: string) => {
      const now = new Date();
      const newApplication: JobApplication = {
        id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        jobId,
        employeeId,
        status: 'applied',
        appliedDate: now,
        lastUpdated: now,
        coverLetter,
        matchScore,
        statusHistory: [
          {
            status: 'applied',
            timestamp: now,
          },
        ],
      };

      setApplications((prev) => [...prev, newApplication]);
    },
    []
  );

  const updateApplicationStatus = useCallback(
    (applicationId: string, newStatus: ApplicationStatus, note?: string) => {
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id === applicationId) {
            const now = new Date();
            return {
              ...app,
              status: newStatus,
              lastUpdated: now,
              statusHistory: [
                ...app.statusHistory,
                {
                  status: newStatus,
                  timestamp: now,
                  note,
                },
              ],
            };
          }
          return app;
        })
      );
    },
    []
  );

  const getApplicationsByJob = useCallback(
    (jobId: string) => {
      return applications.filter((app) => app.jobId === jobId);
    },
    [applications]
  );

  const getApplicationsByEmployee = useCallback(
    (employeeId: string) => {
      return applications.filter((app) => app.employeeId === employeeId);
    },
    [applications]
  );

  const getApplicationById = useCallback(
    (applicationId: string) => {
      return applications.find((app) => app.id === applicationId);
    },
    [applications]
  );

  const hasApplied = useCallback(
    (jobId: string, employeeId: string) => {
      return applications.some(
        (app) => app.jobId === jobId && app.employeeId === employeeId
      );
    },
    [applications]
  );

  const getNewApplicationsCount = useCallback(
    (since?: Date) => {
      const threshold = since || lastViewed;
      return applications.filter(
        (app) => app.appliedDate > threshold
      ).length;
    },
    [applications, lastViewed]
  );

  const markApplicationsAsViewed = useCallback(() => {
    const now = new Date();
    setLastViewed(now);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LAST_VIEWED_KEY, now.toISOString());
    }
  }, []);

  const value: ApplicationContextType = {
    applications,
    submitApplication,
    updateApplicationStatus,
    getApplicationsByJob,
    getApplicationsByEmployee,
    getApplicationById,
    hasApplied,
    getNewApplicationsCount,
    markApplicationsAsViewed,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
}
