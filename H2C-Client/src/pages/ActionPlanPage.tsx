import React, { useState, useEffect } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Target, ShieldAlert, Sparkles, Trophy, Play, Pause, RefreshCw, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ActionPlanPage: React.FC = () => {
  const { actionPlan, isLoading } = useDashboard();
  const [goalCompleted, setGoalCompleted] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  
  // Box Breathing exercise state
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathState, setBreathState] = useState<'Inhale' | 'Hold (Full)' | 'Exhale' | 'Hold (Empty)'>('Inhale');
  const [breathTimer, setBreathTimer] = useState(4);

  // Box Breathing cycle runner
  useEffect(() => {
    let interval: any;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            setBreathState((currentState) => {
              switch (currentState) {
                case 'Inhale': return 'Hold (Full)';
                case 'Hold (Full)': return 'Exhale';
                case 'Exhale': return 'Hold (Empty)';
                case 'Hold (Empty)': return 'Inhale';
                default: return 'Inhale';
              }
            });
            return 4; // Reset to 4 seconds for next box segment
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathingActive]);

  const resetBreathing = () => {
    setBreathingActive(false);
    setBreathState('Inhale');
    setBreathTimer(4);
  };

  if (isLoading || !actionPlan) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  // Box breathing circle animation variants
  const circleVariants = {
    Inhale: { scale: 1.5, transition: { duration: 4, ease: 'easeInOut' } },
    'Hold (Full)': { scale: 1.5 },
    Exhale: { scale: 1, transition: { duration: 4, ease: 'easeInOut' } },
    'Hold (Empty)': { scale: 1 },
  } as const;

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          Your Daily Action Plan
          <Sparkles className="w-6 h-6 text-secondary animate-pulse" />
        </h1>
        <p className="text-sm text-slate-400">
          Personalized daily task targets and nervous system regulation routines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Daily Study Target */}
        <Card gradientBorder className="bg-dark-card/40 flex flex-col justify-between gap-5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Target className="w-5.5 h-5.5 text-secondary" />
              <h2 className="text-base font-black uppercase tracking-widest text-white">Daily Study Goal</h2>
            </div>
            <Badge variant={goalCompleted ? 'success' : 'warning'}>
              {goalCompleted ? 'Completed' : 'Pending'}
            </Badge>
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-white mb-1.5">{actionPlan.dailyGoal.title}</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{actionPlan.dailyGoal.description}</p>
          </div>

          <Button
            variant={goalCompleted ? 'secondary' : 'primary'}
            onClick={() => setGoalCompleted(!goalCompleted)}
            className="w-full flex items-center justify-center gap-2"
          >
            {goalCompleted ? (
              <>
                <RefreshCw className="w-4 h-4" />
                Mark Incomplete
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Mark Target Completed
              </>
            )}
          </Button>
        </Card>

        {/* 2. Personalized Stress Plan */}
        <Card className="bg-dark-card/40 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5.5 h-5.5 text-rose-400" />
            <h2 className="text-base font-black uppercase tracking-widest text-white">Trigger Defuse Coping</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Identified Triggers</p>
              <div className="flex flex-wrap gap-2">
                {actionPlan.stressPlan.triggers.map((trig, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-lg font-semibold">
                    {trig}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Active Defuse Strategy</p>
              <div className="space-y-2">
                {actionPlan.stressPlan.copingMechanisms.map((mech, idx) => (
                  <div key={idx} className="flex gap-2 items-start text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 flex-shrink-0" />
                    <span>{mech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* 3. Interactive Breathing Exercise */}
        <Card className="bg-dark-card/40 md:col-span-1 flex flex-col gap-4">
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5.5 h-5.5 text-emerald-400" />
              <h2 className="text-base font-black uppercase tracking-widest text-white">{actionPlan.mindfulnessExercise.title}</h2>
            </div>
            <Badge variant="success">{actionPlan.mindfulnessExercise.duration} Min Session</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Visual breathing guide */}
            <div className="flex flex-col items-center justify-center p-6 bg-white/2 rounded-xl relative overflow-hidden h-[180px]">
              <motion.div
                variants={circleVariants}
                animate={breathingActive ? breathState : 'Hold (Empty)'}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500/40 to-cyan-500/40 border-2 border-emerald-400 flex items-center justify-center relative shadow-lg shadow-emerald-500/10"
              >
                <div className="w-4 h-4 bg-white rounded-full" />
              </motion.div>

              <div className="absolute flex flex-col items-center bottom-4 text-center">
                <span className="text-sm font-black text-white">{breathState}</span>
                <span className="text-[10px] text-emerald-400 font-bold tracking-widest mt-0.5">{breathTimer}s</span>
              </div>
            </div>

            {/* Steps / Description */}
            <div className="flex flex-col justify-between h-full gap-3">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Instructions</p>
                <div className="space-y-1 max-h-[110px] overflow-y-auto pr-1">
                  {actionPlan.mindfulnessExercise.steps.map((step, idx) => (
                    <p key={idx} className="text-[10px] sm:text-xs text-slate-400 leading-normal">
                      {idx + 1}. {step}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={breathingActive ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => setBreathingActive(!breathingActive)}
                  className="flex-1 flex items-center justify-center gap-1.5"
                >
                  {breathingActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {breathingActive ? 'Pause' : 'Start'}
                </Button>
                <Button variant="ghost" size="sm" onClick={resetBreathing} className="border border-white/5">
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* 4. Weekly motivation challenge */}
        <Card className="bg-dark-card/40 flex flex-col justify-between gap-5">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Trophy className="w-5.5 h-5.5 text-amber-400 animate-bounce" />
              <h2 className="text-base font-black uppercase tracking-widest text-white">Daily Focus Sprint</h2>
            </div>
            <Badge variant={challengeCompleted ? 'success' : 'info'}>
              {challengeCompleted ? 'Sprint Cleared' : 'Active'}
            </Badge>
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-white mb-1.5">{actionPlan.motivationChallenge.title}</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{actionPlan.motivationChallenge.description}</p>
            
            <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-2 text-xs text-amber-300">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span><strong>Reward:</strong> {actionPlan.motivationChallenge.reward}</span>
            </div>
          </div>

          <Button
            variant={challengeCompleted ? 'secondary' : 'primary'}
            onClick={() => setChallengeCompleted(!challengeCompleted)}
            className="w-full flex items-center justify-center gap-2"
          >
            {challengeCompleted ? 'Clear Sprint State' : 'Claim Sprint Reward'}
          </Button>
        </Card>
      </div>
    </PageContainer>
  );
};
