'use client';

interface PoemInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function PoemInput({ value, onChange }: PoemInputProps) {
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-zinc-300">Poem</label>
        <span className="text-xs text-zinc-500">{wordCount} words</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-80 p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 font-serif text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="Paste your poem here..."
      />
    </div>
  );
}
