'use client';

import { Trait } from '../types';

interface TraitEditorProps {
  traits: Trait[];
  onChange: (traits: Trait[]) => void;
}

export function TraitEditor({ traits, onChange }: TraitEditorProps) {
  const updateTrait = (id: string, field: keyof Trait, value: string) => {
    onChange(
      traits.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const addTrait = () => {
    if (traits.length >= 7) return;
    const newTrait: Trait = {
      id: `trait-${Date.now()}`,
      name: '',
      description: '',
      rubric: '1-3: Low, 4-6: Medium, 7-10: High',
    };
    onChange([...traits, newTrait]);
  };

  const removeTrait = (id: string) => {
    if (traits.length <= 3) return;
    onChange(traits.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-zinc-300">
          Traits to Analyze ({traits.length}/7)
        </label>
        <button
          onClick={addTrait}
          disabled={traits.length >= 7}
          className="text-xs px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded transition-colors"
        >
          + Add Trait
        </button>
      </div>

      <div className="space-y-3">
        {traits.map((trait, index) => (
          <div
            key={trait.id}
            className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg space-y-3"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs text-zinc-500">Trait {index + 1}</span>
              <button
                onClick={() => removeTrait(trait.id)}
                disabled={traits.length <= 3}
                className="text-xs text-zinc-500 hover:text-red-400 disabled:hover:text-zinc-500 transition-colors"
              >
                Remove
              </button>
            </div>

            <input
              type="text"
              value={trait.name}
              onChange={(e) => updateTrait(trait.id, 'name', e.target.value)}
              placeholder="Trait name (e.g., Melancholy)"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />

            <textarea
              value={trait.description}
              onChange={(e) => updateTrait(trait.id, 'description', e.target.value)}
              placeholder="Description of what this trait measures..."
              rows={2}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded text-zinc-100 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
            />

            <input
              type="text"
              value={trait.rubric}
              onChange={(e) => updateTrait(trait.id, 'rubric', e.target.value)}
              placeholder="Rubric (e.g., 1-3: Low, 4-6: Medium, 7-10: High)"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
