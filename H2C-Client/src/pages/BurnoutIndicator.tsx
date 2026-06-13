import React from 'react';
import { Card } from '../components/ui/Card';
import { ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

interface BurnoutIndicatorProps {
  risk: number; // 0 to 100
}

export const BurnoutIndicator: React.FC<BurnoutIndicatorProps> = ({ risk }) => {
  const getRiskStatus = (val: number) => {
    if (val >= 75) return { label: 'High Danger', color: 'text-danger', stroke: '#EF4444', icon: ShieldAlert, desc: 'Critical danger of exam exhaustion. Schedule a 24h study break immediately.' };
    if (val >= 45) return { label: 'Moderate Stress', color: 'text-warning', stroke: '#F59E0B', icon: AlertTriangle, desc: 'Elevated preparation fatigue. Reduce study sprint hours.' };
    return { label: 'Optimal Recovery', color: 'text-success', stroke: '#10B981', icon: CheckCircle2, desc: 'Balanced cognitive loading. Keep maintaining current micro-rests.' };
  };

  const status = getRiskStatus(risk);
  const StatusIcon = status.icon;

  // SVG parameters for circle
  const radius = 50;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (risk / 100) * circumference;

  return (
    <Card className="flex flex-col items-center text-center gap-4 relative overflow-hidden bg-dark-card/40">
      <div className="absolute top-2 right-2 text-[10px] uppercase tracking-widest text-slate-500 font-extrabold">
        Risk Assessment
      </div>

      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Burnout Index</h3>

      {/* SVG Arc Gauge */}
      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          {/* Base Circle */}
          <circle
            stroke="rgba(255, 255, 255, 0.05)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Accent progress line */}
          <circle
            stroke={status.stroke}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center label */}
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-black text-white">{risk}%</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Level</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 mt-1">
        <div className={`flex items-center gap-1.5 text-xs font-black ${status.color} uppercase tracking-widest`}>
          <StatusIcon className="w-4 h-4" />
          {status.label}
        </div>
        <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed">
          {status.desc}
        </p>
      </div>
    </Card>
  );
};
