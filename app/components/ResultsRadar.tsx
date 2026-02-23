'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { PoemAnalysis } from '../types';

interface ResultsRadarProps {
  analyses: PoemAnalysis[];
}

export function ResultsRadar({ analyses }: ResultsRadarProps) {
  if (analyses.length === 0) return null;

  // Get trait names from the first analysis
  const traitNames = analyses[0].scores.map((s) => s.trait);

  // Build chart data: one object per trait, with each poem's score as a property
  const chartData = traitNames.map((trait) => {
    const dataPoint: Record<string, string | number> = { trait };
    analyses.forEach((analysis) => {
      const score = analysis.scores.find((s) => s.trait === trait);
      dataPoint[analysis.name] = score?.score || 0;
    });
    return dataPoint;
  });

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis
            dataKey="trait"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tick={{ fill: '#6b7280', fontSize: 10 }}
          />
          {analyses.map((analysis) => (
            <Radar
              key={analysis.id}
              name={analysis.name}
              dataKey={analysis.name}
              stroke={analysis.color}
              fill={analysis.color}
              fillOpacity={0.2}
            />
          ))}
          <Legend wrapperStyle={{ color: '#e5e7eb' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#e5e7eb',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
