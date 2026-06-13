import React from 'react';
import { Card } from '../components/ui/Card';
import { Brain, Sparkles, TrendingUp, Info } from 'lucide-react';

interface WeeklySummaryProps {
  summary: string;
  insights: string[];
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({ summary, insights }) => {
  return (
    <Card className="bg-dark-card/40 flex flex-col gap-5 h-full">
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
        <h3 className="text-sm font-black text-white uppercase tracking-widest">AI Weekly Health Insights</h3>
      </div>

      <div className="flex gap-3 items-start bg-white/2 p-3.5 border border-white/5 rounded-xl">
        <Brain className="w-5 h-5 text-primary-light flex-shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          {summary}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Core Observations
        </h4>
        <div className="space-y-2">
          {insights.map((ins, idx) => (
            <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-300 bg-white/1 px-3 py-2.5 rounded-xl border border-white/2 hover:border-white/5 transition-colors">
              <Info className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{ins}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
