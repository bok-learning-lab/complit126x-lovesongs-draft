import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GenerateLyricsRequest } from '../../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body: GenerateLyricsRequest = await request.json();
    const { averagedScores } = body;

    if (!averagedScores || averagedScores.length === 0) {
      return NextResponse.json(
        { error: 'Averaged scores are required' },
        { status: 400 }
      );
    }

    const scoreList = averagedScores
      .map((s) => `- ${s.trait}: ${s.score.toFixed(1)}/10`)
      .join('\n');

    const prompt = `Write a sonnet with the following trait scores (scale of 1-10):

${scoreList}

Write exactly 14 lines in iambic pentameter with an ABAB CDCD EFEF GG rhyme scheme. Do not include a title.`;

    const response = await openai.responses.create({
      model: 'gpt-4o',
      input: prompt,
    });

    return NextResponse.json({ sonnet: response.output_text });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate sonnet' },
      { status: 500 }
    );
  }
}
