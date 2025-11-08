'use client';

import { BigFiveTraits } from '@/types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface PersonalityRadarProps {
  traits: BigFiveTraits;
}

export function PersonalityRadar({ traits }: PersonalityRadarProps) {
  const data = [
    {
      trait: 'Openness',
      value: traits.openness,
      fullMark: 100,
    },
    {
      trait: 'Conscientiousness',
      value: traits.conscientiousness,
      fullMark: 100,
    },
    {
      trait: 'Extraversion',
      value: traits.extraversion,
      fullMark: 100,
    },
    {
      trait: 'Agreeableness',
      value: traits.agreeableness,
      fullMark: 100,
    },
    {
      trait: 'Emotional Stability',
      value: 100 - traits.neuroticism, // Inverted for better visualization
      fullMark: 100,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="trait" />
        <PolarRadiusAxis angle={90} domain={[0, 100]} />
        <Radar
          name="Personality"
          dataKey="value"
          stroke="#8b5cf6"
          fill="#8b5cf6"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
