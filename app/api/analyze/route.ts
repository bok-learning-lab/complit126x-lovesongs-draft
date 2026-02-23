import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { AnalyzeRequest } from '../../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TraitAnalysisSchema = z.object({
  analysis: z.array(
    z.object({
      trait: z.string(),
      score: z.number(),
      reasoning: z.string(),
    })
  ),
});

export async function POST(request: Request) {
  try {
    const body: AnalyzeRequest = await request.json();
    const { poem, traits } = body;

    if (!poem || !traits || traits.length === 0) {
      return NextResponse.json(
        { error: 'Poem and traits are required' },
        { status: 400 }
      );
    }

    const traitDescriptions = traits
      .map(
        (t) =>
          `- ${t.name}: ${t.description}\n  Scoring rubric: ${t.rubric}`
      )
      .join('\n');

    const systemPrompt = `You are a literary analyst. Analyze the given poem and score it on the specified traits.

For each trait, provide:
1. A score from 1-10 based on the rubric provided
2. A brief reasoning (1-2 sentences) explaining your score

Be precise and consistent in your scoring. Use the full range of the scale.`;

    const userPrompt = `Analyze this poem:

"""
${poem}
"""

Score it on these traits:
${traitDescriptions}

Return your analysis as JSON with scores and reasoning for each trait.`;

    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-2024-08-06',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: zodResponseFormat(TraitAnalysisSchema, 'trait_analysis'),
    });

    const result = completion.choices[0].message.parsed;

    return NextResponse.json(result);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze poem' },
      { status: 500 }
    );
  }
}
