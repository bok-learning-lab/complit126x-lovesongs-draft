import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { sonnets } = await req.json() as { sonnets: string[] };

  const prompt = `Here are three Shakespeare sonnets:

${sonnets.map((s, i) => `--- Sonnet ${i + 1} ---\n${s}`).join('\n\n')}

Write a new sonnet in Shakespeare's style — 14 lines, iambic pentameter, ABAB CDCD EFEF GG rhyme scheme. Draw on the imagery, themes, and emotional register of the sonnets above, but write something original. Do not copy lines.`;

  const response = await openai.responses.create({
    model: 'gpt-4o',
    input: prompt,
  });

  return NextResponse.json({ sonnet: response.output_text });
}
