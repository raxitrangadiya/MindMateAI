import React from 'react';
import { JournalEntry } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CalendarDays, AlertTriangle } from 'lucide-react';
import { SkeletonCard } from '../components/ui/LoadingSpinner';

interface JournalHistoryProps {
  entries: JournalEntry[];
  isLoading: boolean;
  onSelectEntry: (entry: JournalEntry) => void;
  activeId?: string;
}

export const JournalHistory: React.FC<JournalHistoryProps> = ({
  entries,
  isLoading,
  onSelectEntry,
  activeId,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center text-slate-500 border-dashed border-white/10 bg-transparent">
        <CalendarDays className="w-8 h-8 text-slate-600 mb-2" />
        <p className="text-xs font-semibold text-slate-400">No journal logs yet</p>
        <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">Write your first entry on the right to start tracking emotions.</p>
      </Card>
    );
  }

  const getMoodBadgeColor = (mood?: string) => {
    switch (mood) {
      case 'very_high': return 'success';
      case 'high': return 'secondary';
      case 'neutral': return 'info';
      case 'low': return 'warning';
      case 'very_low': return 'danger';
      default: return 'primary';
    }
  };

  return (
    <div className="flex flex-col gap-3.5 max-h-[600px] overflow-y-auto pr-1">
      {entries.map((entry) => {
        const dateStr = new Date(entry.createdAt).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        const hasDistortion = entry.analysis && entry.analysis.cognitiveDistortions.length > 0;

        return (
          <button
            key={entry.id}
            onClick={() => onSelectEntry(entry)}
            className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-2.5 ${
              activeId === entry.id
                ? 'bg-primary/15 border-primary/40 shadow-lg shadow-primary/5'
                : 'bg-white/3 border-white/5 hover:bg-white/6 hover:border-white/10'
            }`}
          >
            <div className="flex justify-between items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400">{dateStr}</span>
              {entry.analysis && (
                <div className="flex items-center gap-1.5">
                  {hasDistortion && (
                    <span title="Distortions detected">
                      <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                    </span>
                  )}
                  <Badge variant={getMoodBadgeColor(entry.analysis.mood)}>
                    {entry.analysis.mood.replace('_', ' ')}
                  </Badge>
                </div>
              )}
            </div>
            
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {entry.content}
            </p>
          </button>
        );
      })}
    </div>
  );
};
