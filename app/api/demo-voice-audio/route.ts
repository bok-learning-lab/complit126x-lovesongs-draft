import { NextResponse } from 'next/server';

const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? '';
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY ?? '';

export async function POST(req: Request) {
  const { text } = await req.json() as { text: string };

  if (!ELEVENLABS_VOICE_ID || !ELEVENLABS_API_KEY) {
    return NextResponse.json({ error: 'ElevenLabs not configured' }, { status: 503 });
  }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );

  if (!res.ok) {
    const msg = await res.text();
    return NextResponse.json({ error: msg }, { status: res.status });
  }

  const audioBuffer = await res.arrayBuffer();
  return new Response(audioBuffer, {
    headers: { 'Content-Type': 'audio/mpeg' },
  });
}
