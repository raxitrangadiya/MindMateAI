import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Card } from '../ui/Card';

interface TrendData {
  date: string;
  mood: number;
  stress: number;
  anxiety: number;
  motivation: number;
}

interface TrendChartProps {
  data: TrendData[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const [activeSeries, setActiveSeries] = useState({
    mood: true,
    stress: true,
    anxiety: true,
    motivation: true,
  });

  const toggleSeries = (series: keyof typeof activeSeries) => {
    setActiveSeries((prev) => ({
      ...prev,
      [series]: !prev[series],
    }));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-card border border-white/10 p-4 rounded-xl shadow-xl backdrop-blur-md">
          <p className="text-xs font-semibold text-slate-400 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((p: any) => (
              <div key={p.name} className="flex items-center justify-between gap-4 text-sm">
                <span className="flex items-center gap-1.5 font-medium" style={{ color: p.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                  {p.name}:
                </span>
                <span className="font-bold text-white">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Mental Metrics Trend</h3>
          <p className="text-xs text-slate-400">Track and correlate emotional health indicator cycles</p>
        </div>

        {/* Series Toggles */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toggleSeries('mood')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
              activeSeries.mood
                ? 'bg-secondary/15 text-secondary border-secondary/35'
                : 'bg-transparent text-slate-500 border-white/5 hover:border-white/10'
            }`}
          >
            Mood (1-5)
          </button>
          <button
            onClick={() => toggleSeries('stress')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
              activeSeries.stress
                ? 'bg-primary/15 text-primary-light border-primary/35'
                : 'bg-transparent text-slate-500 border-white/5 hover:border-white/10'
            }`}
          >
            Stress (0-10)
          </button>
          <button
            onClick={() => toggleSeries('anxiety')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
              activeSeries.anxiety
                ? 'bg-rose-500/15 text-rose-400 border-rose-500/35'
                : 'bg-transparent text-slate-500 border-white/5 hover:border-white/10'
            }`}
          >
            Anxiety (0-10)
          </button>
          <button
            onClick={() => toggleSeries('motivation')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
              activeSeries.motivation
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/35'
                : 'bg-transparent text-slate-500 border-white/5 hover:border-white/10'
            }`}
          >
            Motivation (0-10)
          </button>
        </div>
      </div>

      <div className="w-full h-72 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAnxiety" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMotivation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 10]}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {activeSeries.mood && (
              <Area
                type="monotone"
                name="Mood"
                dataKey="mood"
                stroke="#00D9FF"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorMood)"
              />
            )}
            {activeSeries.stress && (
              <Area
                type="monotone"
                name="Stress"
                dataKey="stress"
                stroke="#6C63FF"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorStress)"
              />
            )}
            {activeSeries.anxiety && (
              <Area
                type="monotone"
                name="Anxiety"
                dataKey="anxiety"
                stroke="#EF4444"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorAnxiety)"
              />
            )}
            {activeSeries.motivation && (
              <Area
                type="monotone"
                name="Motivation"
                dataKey="motivation"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorMotivation)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
