import {
  PersonalityProfile,
  BigFiveTraits,
  DISCTraits,
  MBTIType,
  PersonalityMatch,
} from '@/types';

// ============================================================================
// Personality Matching Algorithms
// ============================================================================

/**
 * Calculate the similarity between two Big Five profiles
 * Uses inverse of Euclidean distance, normalized to 0-100
 */
export function calculateBigFiveMatch(
  profile1: BigFiveTraits,
  profile2: Partial<BigFiveTraits>
): number {
  const traits: (keyof BigFiveTraits)[] = [
    'openness',
    'conscientiousness',
    'extraversion',
    'agreeableness',
    'neuroticism',
  ];

  let sumSquaredDiff = 0;
  let count = 0;

  traits.forEach((trait) => {
    if (profile2[trait] !== undefined) {
      const diff = profile1[trait] - (profile2[trait] as number);
      sumSquaredDiff += diff * diff;
      count++;
    }
  });

  if (count === 0) return 50; // No data to compare

  const distance = Math.sqrt(sumSquaredDiff / count);
  const maxDistance = 100; // Maximum possible distance
  const similarity = Math.max(0, 100 - (distance / maxDistance) * 100);

  return Math.round(similarity);
}

/**
 * Calculate MBTI type compatibility
 * Returns a score based on shared preferences and complementary traits
 */
export function calculateMBTIMatch(
  type1: MBTIType,
  type2: MBTIType | MBTIType[]
): number {
  const types = Array.isArray(type2) ? type2 : [type2];

  const scores = types.map((targetType) => {
    if (type1 === targetType) return 100;

    const chars1 = type1.split('');
    const chars2 = targetType.split('');

    let matches = 0;
    for (let i = 0; i < 4; i++) {
      if (chars1[i] === chars2[i]) matches++;
    }

    // Full match = 100, 3 matches = 75, 2 matches = 50, 1 match = 40, 0 matches = 30
    const baseScore = matches * 25;

    // Bonus for complementary pairs (e.g., INTJ-ENFP)
    const complementary = matches === 0 || matches === 1;
    const bonus = complementary ? 15 : 0;

    return Math.min(100, baseScore + bonus);
  });

  return Math.round(Math.max(...scores));
}

/**
 * Calculate DISC profile similarity
 */
export function calculateDISCMatch(
  profile1: DISCTraits,
  profile2: Partial<DISCTraits>
): number {
  const traits: (keyof DISCTraits)[] = [
    'dominance',
    'influence',
    'steadiness',
    'conscientiousness',
  ];

  let sumSquaredDiff = 0;
  let count = 0;

  traits.forEach((trait) => {
    if (profile2[trait] !== undefined) {
      const diff = profile1[trait] - (profile2[trait] as number);
      sumSquaredDiff += diff * diff;
      count++;
    }
  });

  if (count === 0) return 50;

  const distance = Math.sqrt(sumSquaredDiff / count);
  const maxDistance = 100;
  const similarity = Math.max(0, 100 - (distance / maxDistance) * 100);

  return Math.round(similarity);
}

/**
 * Calculate overall personality match using ensemble approach
 */
export function calculatePersonalityMatch(
  candidateProfile: PersonalityProfile,
  targetProfile: {
    bigFive?: Partial<BigFiveTraits>;
    disc?: Partial<DISCTraits>;
    mbtiTypes?: MBTIType[];
  }
): PersonalityMatch {
  const bigFiveScore = targetProfile.bigFive
    ? calculateBigFiveMatch(candidateProfile.bigFive, targetProfile.bigFive)
    : 50;

  const mbtiScore = targetProfile.mbtiTypes
    ? calculateMBTIMatch(candidateProfile.mbti.type, targetProfile.mbtiTypes)
    : 50;

  const discScore = targetProfile.disc
    ? calculateDISCMatch(candidateProfile.disc, targetProfile.disc)
    : 50;

  // Weighted average (can be adjusted based on importance)
  const overallScore = Math.round(
    (bigFiveScore * 0.4 + mbtiScore * 0.3 + discScore * 0.3)
  );

  const strengths: string[] = [];
  const considerations: string[] = [];

  // Generate insights based on scores
  if (bigFiveScore >= 70) {
    strengths.push('Strong alignment with Big Five personality traits');
  } else if (bigFiveScore < 50) {
    considerations.push('Some personality trait differences to consider');
  }

  if (mbtiScore >= 80) {
    strengths.push('Excellent MBTI type compatibility');
  } else if (mbtiScore < 50) {
    considerations.push('Different MBTI preferences may require adaptation');
  }

  if (discScore >= 70) {
    strengths.push('Well-matched work style (DISC) profile');
  } else if (discScore < 50) {
    considerations.push('Different work style approaches');
  }

  return {
    score: overallScore,
    breakdown: {
      bigFive: bigFiveScore,
      mbti: mbtiScore,
      disc: discScore,
    },
    strengths,
    considerations,
  };
}

/**
 * Get personality insights from Big Five traits
 */
export function getBigFiveInsights(traits: BigFiveTraits): string[] {
  const insights: string[] = [];

  if (traits.openness >= 70) {
    insights.push('Highly creative and open to new experiences');
  } else if (traits.openness <= 30) {
    insights.push('Prefers structure and proven methods');
  }

  if (traits.conscientiousness >= 70) {
    insights.push('Very organized and detail-oriented');
  } else if (traits.conscientiousness <= 30) {
    insights.push('Flexible and spontaneous approach');
  }

  if (traits.extraversion >= 70) {
    insights.push('Energized by social interaction');
  } else if (traits.extraversion <= 30) {
    insights.push('Thrives in focused, independent work');
  }

  if (traits.agreeableness >= 70) {
    insights.push('Highly collaborative and empathetic');
  } else if (traits.agreeableness <= 30) {
    insights.push('Direct and competitive approach');
  }

  if (traits.neuroticism <= 30) {
    insights.push('Calm under pressure and emotionally stable');
  } else if (traits.neuroticism >= 70) {
    insights.push('Sensitive to stress and emotionally reactive');
  }

  return insights;
}

/**
 * Get MBTI type description
 */
export function getMBTIDescription(type: MBTIType): {
  title: string;
  description: string;
  strengths: string[];
} {
  const descriptions: Record<MBTIType, { title: string; description: string; strengths: string[] }> = {
    INTJ: {
      title: 'The Architect',
      description: 'Strategic, logical, and independent thinkers',
      strengths: ['Strategic planning', 'Problem solving', 'Independent work', 'Long-term vision'],
    },
    INTP: {
      title: 'The Logician',
      description: 'Innovative inventors with unquenchable thirst for knowledge',
      strengths: ['Analytical thinking', 'Innovation', 'Theoretical concepts', 'Objective analysis'],
    },
    ENTJ: {
      title: 'The Commander',
      description: 'Bold, imaginative, and strong-willed leaders',
      strengths: ['Leadership', 'Strategic thinking', 'Efficiency', 'Decision making'],
    },
    ENTP: {
      title: 'The Debater',
      description: 'Smart and curious thinkers who love intellectual challenges',
      strengths: ['Innovation', 'Quick thinking', 'Debate', 'Adaptability'],
    },
    INFJ: {
      title: 'The Advocate',
      description: 'Quiet and mystical, yet inspiring idealists',
      strengths: ['Empathy', 'Insight', 'Idealism', 'Planning'],
    },
    INFP: {
      title: 'The Mediator',
      description: 'Poetic, kind, and altruistic people',
      strengths: ['Creativity', 'Empathy', 'Idealism', 'Open-mindedness'],
    },
    ENFJ: {
      title: 'The Protagonist',
      description: 'Charismatic and inspiring leaders',
      strengths: ['Leadership', 'Communication', 'Empathy', 'Organization'],
    },
    ENFP: {
      title: 'The Campaigner',
      description: 'Enthusiastic, creative, and sociable free spirits',
      strengths: ['Enthusiasm', 'Creativity', 'Communication', 'Flexibility'],
    },
    ISTJ: {
      title: 'The Logistician',
      description: 'Practical and fact-minded individuals',
      strengths: ['Reliability', 'Organization', 'Attention to detail', 'Practicality'],
    },
    ISFJ: {
      title: 'The Defender',
      description: 'Very dedicated and warm protectors',
      strengths: ['Supportiveness', 'Reliability', 'Attention to detail', 'Patience'],
    },
    ESTJ: {
      title: 'The Executive',
      description: 'Excellent administrators, managing things and people',
      strengths: ['Organization', 'Leadership', 'Efficiency', 'Decisiveness'],
    },
    ESFJ: {
      title: 'The Consul',
      description: 'Caring, social, and community-minded',
      strengths: ['Cooperation', 'Organization', 'Practicality', 'Warmth'],
    },
    ISTP: {
      title: 'The Virtuoso',
      description: 'Bold and practical experimenters',
      strengths: ['Problem solving', 'Technical skills', 'Adaptability', 'Hands-on approach'],
    },
    ISFP: {
      title: 'The Adventurer',
      description: 'Flexible and charming artists',
      strengths: ['Creativity', 'Flexibility', 'Empathy', 'Aesthetics'],
    },
    ESTP: {
      title: 'The Entrepreneur',
      description: 'Smart, energetic, and perceptive',
      strengths: ['Action-oriented', 'Problem solving', 'Adaptability', 'Social skills'],
    },
    ESFP: {
      title: 'The Entertainer',
      description: 'Spontaneous, energetic, and enthusiastic',
      strengths: ['Enthusiasm', 'Creativity', 'Social skills', 'Adaptability'],
    },
  };

  return descriptions[type];
}

/**
 * Get DISC profile interpretation
 */
export function getDISCInsights(disc: DISCTraits): string[] {
  const insights: string[] = [];
  const dominant = Object.entries(disc).reduce((a, b) => (a[1] > b[1] ? a : b))[0];

  switch (dominant) {
    case 'dominance':
      insights.push('Results-oriented and direct communication style');
      insights.push('Comfortable making quick decisions');
      break;
    case 'influence':
      insights.push('Enthusiastic and persuasive communicator');
      insights.push('Thrives in collaborative environments');
      break;
    case 'steadiness':
      insights.push('Patient and reliable team member');
      insights.push('Values stability and consistency');
      break;
    case 'conscientiousness':
      insights.push('Detail-oriented and systematic approach');
      insights.push('Values accuracy and quality');
      break;
  }

  return insights;
}
