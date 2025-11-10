import { EmployeeProfile, Job, MatchReason } from '@/types';

/**
 * Generate plain-English reasons for why a candidate matches a job
 * Based on real experiences, projects, and skills with specific examples
 */
export function generatePlainEnglishReasons(
  employee: EmployeeProfile,
  job: Job
): MatchReason[] {
  const reasons: MatchReason[] = [];

  // Check for specific technical skills with project evidence
  const matchingTechSkills = employee.skills.filter(s =>
    job.skills.some(js => js.name === s.name)
  );

  if (matchingTechSkills.length > 0) {
    // Find projects that used these skills
    const relevantProject = employee.projects.find(p =>
      matchingTechSkills.some(skill =>
        p.technologies.some(tech => tech.toLowerCase().includes(skill.name.toLowerCase()))
      )
    );

    if (relevantProject) {
      const skillNames = matchingTechSkills.slice(0, 2).map(s => s.name).join(' & ');
      reasons.push({
        point: `Strong ${skillNames} expertise`,
        evidence: `Built "${relevantProject.title}" using these technologies`
      });
    }
  }

  // Check for leadership/mentoring with specific achievements
  const leadershipExp = employee.workExperience.find(e =>
    e.achievements.some(a =>
      a.toLowerCase().includes('mentor') ||
      a.toLowerCase().includes('lead') ||
      a.toLowerCase().includes('trained')
    )
  );

  if (leadershipExp && (job.title.toLowerCase().includes('senior') ||
                       job.title.toLowerCase().includes('lead') ||
                       job.responsibilities.some(r => r.toLowerCase().includes('mentor')))) {
    const achievement = leadershipExp.achievements.find(a =>
      a.toLowerCase().includes('mentor') ||
      a.toLowerCase().includes('lead') ||
      a.toLowerCase().includes('trained')
    );
    if (achievement) {
      reasons.push({
        point: 'Proven leadership and mentoring experience',
        evidence: `${achievement} at ${leadershipExp.company}`
      });
    }
  }

  // Check for measurable impact with specific numbers
  const impactfulExp = employee.workExperience.find(e =>
    e.achievements.some(a => /\d+%|\d+x|\d+\+/.test(a))
  );

  if (impactfulExp) {
    const impactAchievement = impactfulExp.achievements.find(a => /\d+%|\d+x|\d+\+/.test(a));
    if (impactAchievement) {
      reasons.push({
        point: 'Track record of measurable impact',
        evidence: `${impactAchievement} at ${impactfulExp.company}`
      });
    }
  }

  // Check for relevant domain experience from past companies
  const relevantIndustryExp = employee.workExperience.find(e => {
    const jobLower = job.description.toLowerCase();
    const expLower = e.company.toLowerCase() + ' ' + e.position.toLowerCase();

    // Look for industry matches
    if (jobLower.includes('saas') && (expLower.includes('saas') || expLower.includes('software'))) return true;
    if (jobLower.includes('platform') && expLower.includes('platform')) return true;
    if (jobLower.includes('cloud') && expLower.includes('cloud')) return true;
    if (jobLower.includes('infrastructure') && expLower.includes('infrastructure')) return true;

    return false;
  });

  if (relevantIndustryExp) {
    reasons.push({
      point: 'Relevant industry experience',
      evidence: `${relevantIndustryExp.position} at ${relevantIndustryExp.company}`
    });
  }

  // Check for specific project outcomes that match job needs
  const impactfulProject = employee.projects.find(p =>
    p.achievements && p.achievements.some(a =>
      a.toLowerCase().includes('user') ||
      a.toLowerCase().includes('performance') ||
      a.toLowerCase().includes('revenue') ||
      a.toLowerCase().includes('efficiency')
    )
  );

  if (impactfulProject && job.description.toLowerCase().includes('user')) {
    const achievement = impactfulProject.achievements.find(a =>
      a.toLowerCase().includes('user') ||
      a.toLowerCase().includes('performance') ||
      a.toLowerCase().includes('efficiency')
    );
    if (achievement) {
      reasons.push({
        point: 'User-focused execution and outcomes',
        evidence: `${impactfulProject.title}: ${achievement}`
      });
    }
  }

  // Check for collaboration evidence from reviews
  const collaborationReview = employee.reviews.find(r =>
    r.comment.toLowerCase().includes('collaborat') ||
    r.comment.toLowerCase().includes('team') ||
    r.comment.toLowerCase().includes('work with')
  );

  if (collaborationReview && (
    job.description.toLowerCase().includes('collaborate') ||
    job.description.toLowerCase().includes('team')
  )) {
    const reviewer = collaborationReview.reviewerName;
    const snippet = collaborationReview.comment.length > 60
      ? collaborationReview.comment.substring(0, 60) + '...'
      : collaborationReview.comment;
    reasons.push({
      point: 'Strong collaborative approach',
      evidence: `${reviewer}: "${snippet}"`
    });
  }

  // Check for problem-solving with specific examples
  const problemSolvingExp = employee.workExperience.find(e =>
    e.achievements.some(a =>
      a.toLowerCase().includes('optimized') ||
      a.toLowerCase().includes('reduced') ||
      a.toLowerCase().includes('improved') ||
      a.toLowerCase().includes('solved')
    )
  );

  if (problemSolvingExp && job.description.toLowerCase().includes('optimize')) {
    const achievement = problemSolvingExp.achievements.find(a =>
      a.toLowerCase().includes('optimized') ||
      a.toLowerCase().includes('reduced') ||
      a.toLowerCase().includes('improved')
    );
    if (achievement) {
      reasons.push({
        point: 'Demonstrated problem-solving abilities',
        evidence: `${achievement} at ${problemSolvingExp.company}`
      });
    }
  }

  // Check for cultural fit based on reviews
  const cultureReview = employee.reviews.find(r =>
    r.comment.toLowerCase().includes('culture') ||
    r.comment.toLowerCase().includes('value') ||
    r.comment.toLowerCase().includes('attitude')
  );

  if (cultureReview && job.description.toLowerCase().includes('culture')) {
    const snippet = cultureReview.comment.length > 50
      ? cultureReview.comment.substring(0, 50) + '...'
      : cultureReview.comment;
    reasons.push({
      point: 'Cultural alignment',
      evidence: `${cultureReview.reviewerName}: "${snippet}"`
    });
  }

  // Check for scale/complexity experience
  const scaleExp = employee.workExperience.find(e =>
    e.achievements.some(a =>
      a.toLowerCase().includes('million') ||
      a.toLowerCase().includes('scale') ||
      a.toLowerCase().includes('thousands')
    )
  );

  if (scaleExp && (
    job.description.toLowerCase().includes('scale') ||
    job.description.toLowerCase().includes('million')
  )) {
    const achievement = scaleExp.achievements.find(a =>
      a.toLowerCase().includes('million') ||
      a.toLowerCase().includes('scale') ||
      a.toLowerCase().includes('thousands')
    );
    if (achievement) {
      reasons.push({
        point: 'Experience building at scale',
        evidence: achievement
      });
    }
  }

  // Return top 3-4 most relevant reasons
  return reasons.slice(0, 4);
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
