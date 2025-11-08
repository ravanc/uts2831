import {
  PersonalityProfile,
  BigFiveTraits,
  DISCTraits,
  MBTIType,
  MBTITraits,
} from '@/types';

const mbtiTypes: MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

/**
 * Generate random Big Five traits
 */
export function generateBigFive(base?: Partial<BigFiveTraits>): BigFiveTraits {
  const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  return {
    openness: base?.openness ?? random(30, 90),
    conscientiousness: base?.conscientiousness ?? random(30, 90),
    extraversion: base?.extraversion ?? random(20, 90),
    agreeableness: base?.agreeableness ?? random(30, 90),
    neuroticism: base?.neuroticism ?? random(20, 70),
  };
}

/**
 * Generate MBTI traits from type
 */
export function generateMBTI(type?: MBTIType): MBTITraits {
  const selectedType = type || mbtiTypes[Math.floor(Math.random() * mbtiTypes.length)];
  const chars = selectedType.split('');

  return {
    type: selectedType,
    introversion_extraversion: chars[0] === 'E' ? 60 + Math.random() * 40 : Math.random() * 40,
    intuition_sensing: chars[1] === 'N' ? 60 + Math.random() * 40 : Math.random() * 40,
    thinking_feeling: chars[2] === 'T' ? 60 + Math.random() * 40 : Math.random() * 40,
    judging_perceiving: chars[3] === 'J' ? 60 + Math.random() * 40 : Math.random() * 40,
  };
}

/**
 * Generate DISC traits
 */
export function generateDISC(base?: Partial<DISCTraits>): DISCTraits {
  const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  return {
    dominance: base?.dominance ?? random(20, 85),
    influence: base?.influence ?? random(20, 85),
    steadiness: base?.steadiness ?? random(20, 85),
    conscientiousness: base?.conscientiousness ?? random(20, 85),
  };
}

/**
 * Generate complete personality profile
 */
export function generatePersonalityProfile(
  mbtiType?: MBTIType,
  bigFiveBase?: Partial<BigFiveTraits>,
  discBase?: Partial<DISCTraits>
): PersonalityProfile {
  const mbti = generateMBTI(mbtiType);
  const bigFive = generateBigFive(bigFiveBase);
  const disc = generateDISC(discBase);

  // Adjust Big Five based on MBTI for consistency
  const chars = mbti.type.split('');
  if (chars[0] === 'E') bigFive.extraversion = Math.max(bigFive.extraversion, 60);
  if (chars[0] === 'I') bigFive.extraversion = Math.min(bigFive.extraversion, 40);
  if (chars[1] === 'N') bigFive.openness = Math.max(bigFive.openness, 60);
  if (chars[2] === 'F') bigFive.agreeableness = Math.max(bigFive.agreeableness, 60);

  return {
    bigFive,
    mbti,
    disc,
    lastAssessed: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
  };
}

/**
 * Generate random date within range
 */
export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
