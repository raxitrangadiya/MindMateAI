import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Brain, Sparkles, AlertCircle } from 'lucide-react';
import { FloatingParticles } from '../components/landing/FloatingParticles';

export const OnboardingPage: React.FC = () => {
  const { createUser, user } = useUser();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [examType, setExamType] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const exams = [
    { value: 'JEE', label: 'JEE (Engineering)' },
    { value: 'NEET', label: 'NEET (Medical)' },
    { value: 'UPSC', label: 'UPSC (Civil Services)' },
    { value: 'GATE', label: 'GATE (Engineering)' },
    { value: 'CAT', label: 'CAT (Management)' },
    { value: 'CUET', label: 'CUET (Undergrad)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please tell us your name.');
      return;
    }
    if (!examType) {
      setError('Please select your target competitive exam.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await createUser(name.trim(), examType);
      navigate('/dashboard');
    } catch (err) {
      setError('Something went wrong, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-dark flex items-center justify-center p-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <FloatingParticles />

      <Card gradientBorder className="w-full max-w-md relative z-10 flex flex-col gap-6 p-8 bg-dark-card/90">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30 animate-float">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome to MindMate</h2>
            <p className="text-sm text-slate-400 mt-1">Let's personalize your exam wellness space</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/25 rounded-xl text-rose-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="What is your first name?"
            placeholder="e.g. Priyanshu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            required
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">
              Which exam are you preparing for?
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {exams.map((exam) => (
                <button
                  key={exam.value}
                  type="button"
                  onClick={() => setExamType(exam.value)}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border text-center ${
                    examType === exam.value
                      ? 'bg-primary/20 text-white border-primary/50 shadow-md shadow-primary/10'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/15'
                  }`}
                  disabled={isSubmitting}
                >
                  {exam.label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full py-3" isLoading={isSubmitting}>
            <Sparkles className="w-4 h-4 mr-2" />
            Unlock My Dashboard
          </Button>
        </form>
      </Card>
    </div>
  );
};
