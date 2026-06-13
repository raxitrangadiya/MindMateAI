import React from 'react';
import { Card } from '../components/ui/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface TriggerFreq {
  trigger: string;
  count: number;
}

interface StressTriggersProps {
  data: TriggerFreq[];
}

export const StressTriggers: React.FC<StressTriggersProps> = ({ data }) => {
  const COLORS = ['#6C63FF', '#8B83FF', '#00D9FF', '#33E1FF', '#10B981', '#F59E0B'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-card border border-white/10 px-3 py-2 rounded-lg text-xs font-semibold text-white shadow-xl backdrop-blur-md">
          <p className="text-slate-400 mb-0.5">{payload[0].payload.trigger}</p>
          <p>Frequency: <span className="font-extrabold text-secondary">{payload[0].value} logs</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-dark-card/40 flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-black text-white uppercase tracking-widest">Stress Trigger Frequency</h3>
        <p className="text-xs text-slate-400 mt-0.5">Top patterns causing academic stress & worry</p>
      </div>

      <div className="w-full h-52 min-h-[200px]">
        {data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 font-medium border border-dashed border-white/10 rounded-xl">
            No trigger triggers captured yet. Write entries to build graph.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 10, left: 15, bottom: 5 }}
            >
              <XAxis type="number" stroke="#94A3B8" fontSize={10} hide />
              <YAxis
                type="category"
                dataKey="trigger"
                stroke="#94A3B8"
                fontSize={11}
                axisLine={false}
                tickLine={false}
                width={85}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={12}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
