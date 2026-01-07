
import React, { useState } from 'react';
import { Heart, Sparkles, Sun } from 'lucide-react';

interface GratitudeJournalProps {
  onSave: (items: string[]) => void;
  isLoading: boolean;
}

export const GratitudeJournal: React.FC<GratitudeJournalProps> = ({ onSave, isLoading }) => {
  const [entries, setEntries] = useState(['', '', '']);

  const handleChange = (index: number, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = value;
    setEntries(newEntries);
  };

  const isComplete = entries.every(entry => entry.trim().length > 0);

  const handleSubmit = () => {
    if (isComplete) {
      onSave(entries);
      setEntries(['', '', '']);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-orange-50 to-rose-50 rounded-3xl border border-rose-100 shadow-sm space-y-4 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center gap-2 text-rose-600">
        <Sun className="w-5 h-5 animate-pulse" />
        <h2 className="font-bold text-lg tracking-tight">Diario de Gratitud Guiada</h2>
      </div>
      
      <p className="text-xs text-rose-700/70 leading-relaxed italic">
        "La gratitud es la memoria del corazón. Al agradecer, sintonizas con la abundancia que ya te rodea."
      </p>

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div key={index} className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-300 font-bold text-sm">
              {index + 1}.
            </span>
            <input
              type="text"
              value={entry}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder="Hoy agradezco por..."
              className="w-full pl-8 pr-4 py-2 bg-white/60 border border-rose-100 rounded-xl text-sm focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none transition-all placeholder:text-rose-200"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isComplete || isLoading}
        className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
          isComplete && !isLoading
            ? 'bg-rose-500 text-white hover:bg-rose-600 active:scale-95'
            : 'bg-rose-200 text-rose-50 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <Sparkles className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Heart className="w-4 h-4 fill-current" />
            Sintonizar Gratitud
          </>
        )}
      </button>
    </div>
  );
};
