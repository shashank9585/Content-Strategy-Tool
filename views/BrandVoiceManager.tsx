
import React, { useState } from 'react';
import { Plus, Palette, Trash2, Check, Star } from 'lucide-react';
import { BrandVoice } from '../types';

interface Props {
  voices: BrandVoice[];
  onSave: (voice: BrandVoice) => void;
  onDelete: (id: string) => void;
}

export const BrandVoiceManager: React.FC<Props> = ({ voices, onSave, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newVoice, setNewVoice] = useState<Partial<BrandVoice>>({
    name: '',
    tone: 'Confident, Innovative',
    formality: 'Professional',
    vocabulary: 'Industry-specific, Elevated',
    emojiUsage: 'Minimal'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoice.name) return;
    onSave({
      ...newVoice,
      id: Date.now().toString(),
    } as BrandVoice);
    setIsAdding(false);
    setNewVoice({
      name: '',
      tone: 'Confident, Innovative',
      formality: 'Professional',
      vocabulary: 'Industry-specific, Elevated',
      emojiUsage: 'Minimal'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Brand Voices</h2>
          <p className="text-slate-500">Define personality presets for consistent cross-channel messaging.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-teal-700 transition-all shadow-md"
        >
          <Plus size={20} />
          <span>New Preset</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-3xl border-2 border-teal-600 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-800">Preset Name</label>
                <input
                  type="text"
                  required
                  value={newVoice.name}
                  onChange={e => setNewVoice({ ...newVoice, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Luxury Tech, Playful Startup"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-800">Key Tone Words</label>
                <input
                  type="text"
                  value={newVoice.tone}
                  onChange={e => setNewVoice({ ...newVoice, tone: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Sarcastic, Empathetic, Authoritative"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-800">Formality Level</label>
                <select
                  value={newVoice.formality}
                  onChange={e => setNewVoice({ ...newVoice, formality: e.target.value as any })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                >
                  <option>Casual</option>
                  <option>Professional</option>
                  <option>Formal</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-800">Emoji Frequency</label>
                <select
                  value={newVoice.emojiUsage}
                  onChange={e => setNewVoice({ ...newVoice, emojiUsage: e.target.value as any })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                >
                  <option>None</option>
                  <option>Minimal</option>
                  <option>Frequent</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">Vocabulary Style</label>
              <textarea
                value={newVoice.vocabulary}
                onChange={e => setNewVoice({ ...newVoice, vocabulary: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 h-24"
                placeholder="Describe specific words to use or avoid..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 text-slate-600 font-bold"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-teal-700 transition-all"
              >
                Create Preset
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {voices.length === 0 && !isAdding && (
          <div className="col-span-2 text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Palette className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 text-lg">No brand voices created yet.</p>
          </div>
        )}
        {voices.map(voice => (
          <div key={voice.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center">
                  <Star size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{voice.name}</h3>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">{voice.formality}</span>
                </div>
              </div>
              <button 
                onClick={() => onDelete(voice.id)}
                className="text-slate-400 hover:text-red-600 transition-colors p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Tone Characteristics</span>
                <p className="text-sm text-slate-700">{voice.tone}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Vocabulary</span>
                  <p className="text-xs text-slate-600">{voice.vocabulary}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Emojis</span>
                  <p className="text-xs text-slate-600">{voice.emojiUsage}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
