import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useDashboard } from '../hooks/useDashboard';
import { PageContainer } from '../components/layout/PageContainer';
import { TrendChart } from '../components/charts/TrendChart';
import { BurnoutIndicator } from './BurnoutIndicator';
import { WeeklySummary } from './WeeklySummary';
import { StressTriggers } from './StressTriggers';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Card } from '../components/ui/Card';
import { Sparkles, CalendarDays, BrainCircuit, MessageCircleHeart } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { dashboardData, isLoading, refresh } = useDashboard();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (isLoading || !dashboardData) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  // Calculate quick stats
  const totalLogs = dashboardData.recentMoodTrend.length;
  const averageStress = Math.round(
    dashboardData.recentMoodTrend.reduce((acc, curr) => acc + curr.stress, 0) / totalLogs
  );
  const averageAnxiety = Math.round(
    dashboardData.recentMoodTrend.reduce((acc, curr) => acc + curr.anxiety, 0) / totalLogs
  );

  return (
    <PageContainer className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            Hey, {user?.name}!
            <Sparkles className="w-6 h-6 text-secondary animate-pulse" />
          </h1>
          <p className="text-sm text-slate-400">
            Here is your mental wellness overview for the <span className="text-secondary font-semibold uppercase">{user?.examType}</span> preparation cycle.
          </p>
        </div>
        
        <div className="text-xs text-slate-400 font-medium">
          Last updated: {new Date().toLocaleDateString(undefined, { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="flex items-center gap-4 bg-white/2 hover:bg-white/4 transition-colors">
          <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Weekly Logs</p>
            <p className="text-lg font-black text-white">{totalLogs} Entries</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-white/2 hover:bg-white/4 transition-colors">
          <div className="p-3 bg-primary/10 rounded-xl text-primary-light">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Avg. Stress Index</p>
            <p className="text-lg font-black text-white">{averageStress}/10</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-white/2 hover:bg-white/4 transition-colors">
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
            <MessageCircleHeart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Avg. Anxiety Index</p>
            <p className="text-lg font-black text-white">{averageAnxiety}/10</p>
          </div>
        </Card>
      </div>

      {/* Grid Layout of charts & indicator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Trend Graph - Span 8 */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <TrendChart data={dashboardData.recentMoodTrend} />
        </div>
        
        {/* Burnout circular gauge - Span 4 */}
        <div className="lg:col-span-4 h-full">
          <BurnoutIndicator risk={dashboardData.burnoutRisk} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* AI weekly summary - Span 7 */}
        <div className="lg:col-span-7 h-full">
          <WeeklySummary
            summary={dashboardData.weeklySummary}
            insights={dashboardData.insights}
          />
        </div>

        {/* Stress triggers count - Span 5 */}
        <div className="lg:col-span-5 h-full">
          <StressTriggers data={dashboardData.triggersFrequency} />
        </div>
      </div>
    </PageContainer>
  );
};
