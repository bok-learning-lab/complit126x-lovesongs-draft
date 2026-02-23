import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'complit126x-love-songs.ipynb');

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Notebook not found' }, { status: 404 });
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');

  return new NextResponse(fileContent, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="complit126x-love-songs.ipynb"',
    },
  });
}
