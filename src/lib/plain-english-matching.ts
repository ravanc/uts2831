import { EmployeeProfile, Job } from '@/types';

/**
 * Generate plain-English reasons for why a candidate matches a job
 * Based on real experiences, projects, and skills
 */
export function generatePlainEnglishReasons(
  employee: EmployeeProfile,
  job: Job
): string[] {
  const reasons: string[] = [];

  // Check for presentation/communication skills
  const hasPresentation = employee.projects.some(p =>
    p.technologies.some(t => t.toLowerCase().includes('figma') ||
                            t.toLowerCase().includes('slides') ||
                            t.toLowerCase().includes('powerpoint'))
  );

  if (hasPresentation && (job.title.toLowerCase().includes('marketing') ||
                          job.title.toLowerCase().includes('design') ||
                          job.title.toLowerCase().includes('product'))) {
    reasons.push("You build crisp slides and narratives");
  }

  // Check for technical/programming skills
  const techSkills = employee.skills.filter(s =>
    ['React', 'Python', 'TypeScript', 'Node.js', 'Java'].includes(s.name)
  );

  if (techSkills.length >= 2 && job.title.toLowerCase().includes('engineer')) {
    const skillList = techSkills.slice(0, 2).map(s => s.name).join(' and ');
    reasons.push(`Strong ${skillList} expertise from hands-on projects`);
  }

  // Check for data/algorithm experience
  const hasDataExperience = employee.skills.some(s =>
    s.name.toLowerCase().includes('python') ||
    s.name.toLowerCase().includes('tensorflow') ||
    s.name.toLowerCase().includes('data')
  );

  if (hasDataExperience && (job.title.toLowerCase().includes('data') ||
                            job.title.toLowerCase().includes('ml') ||
                            job.title.toLowerCase().includes('algorithm'))) {
    reasons.push("Your algorithmic work aligns with their data processing needs");
  }

  // Check for collaboration style
  if (employee.personality.bigFive.agreeableness > 65) {
    if (job.remotePolicy === 'remote') {
      reasons.push("You thrive in async, collaborative environments");
    } else {
      reasons.push("You excel in team settings with strong collaboration");
    }
  }

  // Check for entrepreneurial experience
  const hasEntrepreneurialExp = employee.interests.some(i =>
    i.topics.some(t => t.toLowerCase().includes('startup') ||
                      t.toLowerCase().includes('entrepreneur'))
  ) || employee.workExperience.some(e =>
    e.company.toLowerCase().includes('startup')
  );

  if (hasEntrepreneurialExp && job.companyId.includes('002')) { // InnovateTech is startup
    reasons.push("Your startup experience fits their fast-paced culture");
  }

  // Check for leadership/mentoring
  const hasLeadership = employee.workExperience.some(e =>
    e.achievements.some(a =>
      a.toLowerCase().includes('mentor') ||
      a.toLowerCase().includes('lead') ||
      a.toLowerCase().includes('team')
    )
  );

  if (hasLeadership && (job.title.toLowerCase().includes('senior') ||
                       job.title.toLowerCase().includes('lead'))) {
    reasons.push("Proven mentorship experience from past roles");
  }

  // Check for design/UX skills
  const hasDesignSkills = employee.skills.some(s =>
    s.name.toLowerCase().includes('figma') ||
    s.name.toLowerCase().includes('design') ||
    s.name.toLowerCase().includes('ux')
  );

  if (hasDesignSkills && job.title.toLowerCase().includes('design')) {
    reasons.push("Your user-centered design approach matches their needs");
  }

  // Add company-specific reasons based on job requirements
  if (job.requirements.required.some(r => r.toLowerCase().includes('cloud'))) {
    const hasCloud = employee.skills.some(s =>
      s.name.toLowerCase().includes('aws') ||
      s.name.toLowerCase().includes('azure') ||
      s.name.toLowerCase().includes('docker')
    );
    if (hasCloud) {
      reasons.push("They're investing in cloud infrastructure now");
    }
  }

  // Fast-paced environment match
  if (employee.personality.bigFive.openness > 70 &&
      job.companyId.includes('002')) { // Startup
    reasons.push("You adapt quickly to fast-changing priorities");
  }

  // Detail-oriented for specific roles
  if (employee.personality.bigFive.conscientiousness > 75 &&
      (job.title.toLowerCase().includes('engineer') ||
       job.title.toLowerCase().includes('architect'))) {
    reasons.push("Your attention to detail fits complex system work");
  }

  // Communication for cross-functional roles
  if (employee.personality.bigFive.extraversion > 60 &&
      (job.title.toLowerCase().includes('product') ||
       job.title.toLowerCase().includes('manager'))) {
    reasons.push("Strong communication skills for cross-team coordination");
  }

  // Innovation focus
  if (employee.personality.bigFive.openness > 80 &&
      job.description.toLowerCase().includes('innovation')) {
    reasons.push("Your creative problem-solving drives innovation");
  }

  // Return top 3 most relevant reasons
  return reasons.slice(0, 3);
}

/**
 * Generate a summary reason for a quick glance
 */
export function generateSummaryReason(
  employee: EmployeeProfile,
  job: Job
): string {
  const topSkills = employee.skills
    .filter(s => job.skills.some(js => js.name === s.name))
    .slice(0, 2)
    .map(s => s.name);

  if (topSkills.length >= 2) {
    return `${topSkills.join(' + ')} expertise matches team needs`;
  } else if (topSkills.length === 1) {
    return `${topSkills[0]} experience aligns with role`;
  }

  // Fallback to personality-based reason
  if (employee.personality.bigFive.openness > 75) {
    return "Innovative mindset fits their culture";
  } else if (employee.personality.bigFive.conscientiousness > 75) {
    return "Detail-oriented approach matches requirements";
  } else if (employee.personality.bigFive.agreeableness > 75) {
    return "Collaborative style fits team dynamic";
  }

  return "Experience and skills align well";
}
