import React from 'react';
import { JournalEntry } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Heart, ShieldAlert, Sparkles, BrainCircuit, Activity, CheckCircle2 } from 'lucide-react';

interface JournalAnalysisProps {
  entry: JournalEntry;
}

export const JournalAnalysisView: React.FC<JournalAnalysisProps> = ({ entry }) => {
  const analysis = entry.analysis;

  if (!analysis) {
    return (
      <Card className="p-6 text-center text-slate-500 bg-white/2">
        We couldn't load the AI analysis for this entry.
      </Card>
    );
  }

  const getProgressColor = (val: number) => {
    if (val >= 8) return 'bg-danger';
    if (val >= 5) return 'bg-warning';
    return 'bg-success';
  };

  const getMoodBadgeColor = (mood: string) => {
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
    <Card className="bg-dark-card/40 border border-white/10 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
            AI Cognitive Breakdown
          </h2>
          <p className="text-xs text-slate-400">Analysis for {new Date(entry.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={getMoodBadgeColor(analysis.mood)}>Mood: {analysis.mood.replace('_', ' ')}</Badge>
          <Badge variant="primary">Emotion: {analysis.primaryEmotion}</Badge>
        </div>
      </div>

      {/* Narrative Summary */}
      <div className="bg-white/3 border border-white/5 rounded-xl p-4 flex gap-3 items-start">
        <Heart className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-1">Empathetic Summary</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{analysis.summary}</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stress */}
        <div className="p-4 rounded-xl bg-white/2 border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stress Level</span>
            <span className="text-sm font-black text-white">{analysis.stressLevel}/10</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(analysis.stressLevel)}`}
              style={{ width: `${analysis.stressLevel * 10}%` }}
            />
          </div>
        </div>

        {/* Anxiety */}
        <div className="p-4 rounded-xl bg-white/2 border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Anxiety Level</span>
            <span className="text-sm font-black text-white">{analysis.anxietyLevel}/10</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(analysis.anxietyLevel)}`}
              style={{ width: `${analysis.anxietyLevel * 10}%` }}
            />
          </div>
        </div>

        {/* Motivation */}
        <div className="p-4 rounded-xl bg-white/2 border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Motivation</span>
            <span className="text-sm font-black text-white">{analysis.motivationLevel}/10</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${analysis.motivationLevel * 10}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cognitive Distortions */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-warning" />
            Cognitive Distortions Spotted
          </h3>
          {analysis.cognitiveDistortions.length > 0 ? (
            <div className="flex flex-col gap-2">
              {analysis.cognitiveDistortions.map((dist, idx) => (
                <div key={idx} className="p-3 bg-warning/5 border border-warning/15 rounded-xl text-xs text-amber-300 font-medium">
                  <strong>{dist}</strong>: Reframing this pattern will improve focus and lower exam stress.
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl text-xs text-emerald-400 font-semibold">
              No negative cognitive distortions detected. Great mental framing!
            </div>
          )}
        </div>

        {/* Triggers */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-secondary" />
            Detected Stress Triggers
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.triggers.map((trig, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-slate-300"
              >
                {trig}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actionable Recommendations */}
      <div className="flex flex-col gap-3 border-t border-white/5 pt-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
          <BrainCircuit className="w-4.5 h-4.5 text-primary-light animate-float" />
          AI Mind-Care Recommendations
        </h3>
        <div className="grid grid-cols-1 gap-2.5">
          {analysis.recommendations.map((rec, idx) => (
            <div key={idx} className="flex gap-2.5 items-start p-3 bg-primary/5 border border-primary/10 rounded-xl">
              <CheckCircle2 className="w-4.5 h-4.5 text-primary-light flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
