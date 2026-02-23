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

    const userPrompt = `Write a love song with the following trait scores (scale of 1-10):

${scoreList}

Write complete song lyrics with a verse, a chorus, and a bridge.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [{ role: 'user', content: userPrompt }],
    });

    const lyrics = completion.choices[0].message.content;

    return NextResponse.json({ lyrics });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate lyrics' },
      { status: 500 }
    );
  }
}
