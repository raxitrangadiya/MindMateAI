import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Brain, Sparkles, AlertCircle, Lock, Mail, User as UserIcon, LogIn, UserPlus } from 'lucide-react';
import { FloatingParticles } from '../components/landing/FloatingParticles';

export const AuthPage: React.FC = () => {
  const { login, register, demoLogin } = useUser();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !examType) {
      setError('Please fill in all fields and select your target exam.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password, examType);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try a different email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoMode = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to enter Demo Mode. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-dark flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />
      <FloatingParticles />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3 text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30 animate-float">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              MindMate <span className="text-secondary">AI</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 uppercase tracking-widest">
              Empathetic exam preparation wellness companion
            </p>
          </div>
        </div>

        <Card gradientBorder className="w-full bg-dark-card/90 flex flex-col gap-6 p-8 shadow-2xl">
          <h2 className="text-lg font-bold text-center text-white tracking-tight">Welcome to MindMate</h2>
          
          {/* Tabs header */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Sign Up
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/25 rounded-xl text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <Button type="submit" variant="primary" className="w-full py-3 mt-2" isLoading={isSubmitting}>
                <LogIn className="w-4 h-4 mr-2" />
                Access Dashboard
              </Button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <Input
                  type="text"
                  placeholder="First Name"
                  className="pl-11"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="flex flex-col gap-2 mt-1">
                <label className="text-xs font-semibold text-slate-300">
                  Target Competitive Exam
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {exams.map((exam) => (
                    <button
                      key={exam.value}
                      type="button"
                      onClick={() => setExamType(exam.value)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border text-center ${
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

              <Button type="submit" variant="primary" className="w-full py-3 mt-2" isLoading={isSubmitting}>
                <Sparkles className="w-4 h-4 mr-2" />
                Create Free Account
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Quick Demo Access */}
          <div className="flex flex-col gap-2.5">
            <div className="bg-secondary/5 border border-secondary/15 rounded-2xl p-4 flex flex-col gap-2 text-center">
              <h3 className="text-xs font-extrabold text-secondary-light flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Instant Demo Access
              </h3>
              <p className="text-[10px] text-slate-400 leading-normal max-w-xs mx-auto">
                Explore the dashboard pre-seeded with rich test-stress metrics, analysis charts, and AI coach chat logs without signing up.
              </p>
              <button
                type="button"
                onClick={handleDemoMode}
                disabled={isSubmitting}
                className="mt-1.5 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-secondary/85 to-primary/85 hover:from-secondary hover:to-primary text-white text-xs font-extrabold tracking-wide hover:shadow-lg hover:shadow-secondary/15 active:scale-98 transition-all disabled:opacity-50"
              >
                Launch Demo Workspace
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
