import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { BrainNetwork } from './BrainNetwork';
import { FloatingParticles } from './FloatingParticles';
import { Brain, Heart, Sparkles, Target, Zap, Shield, ChevronRight, MessageSquare, BookOpen, BarChart3 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleCTA = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Cognitive Journaling',
      description: 'Write freely about your prep stress. Our AI instantly extracts triggers, emotions, and cognitive distortions.',
      color: 'text-secondary bg-secondary/10'
    },
    {
      icon: MessageSquare,
      title: '24/7 AI Wellness Coach',
      description: 'An empathetic coach tailored to academic pressures. Get active-recall scheduling advice or instant panic relief.',
      color: 'text-primary-light bg-primary/10'
    },
    {
      icon: BarChart3,
      title: 'Burnout Risk Analytics',
      description: 'Monitor emotional trends and stress indicators with neat charts to prevent study-fatigue crashes before they happen.',
      color: 'text-emerald-400 bg-emerald-400/10'
    },
    {
      icon: Target,
      title: 'Personalized Action Plans',
      description: 'Get daily manageable goals, tailored coping methods for identified stress triggers, and guided breathing exercises.',
      color: 'text-amber-400 bg-amber-400/10'
    }
  ];

  const testimonials = [
    {
      quote: "MindMate was a game-changer during my UPSC prep. The AI coach helped me organize my revision sprints when I felt completely paralyzed by the syllabus size.",
      name: "Aditya Sharma",
      role: "UPSC Aspirant (Rank 112)"
    },
    {
      quote: "The journal analysis made me realize my stress spikes right after mock tests. Learning to reframe errors as data points saved my sanity before JEE.",
      name: "Sneha Patel",
      role: "JEE Candidate (IIT Bombay)"
    },
    {
      quote: "I used the 4-7-8 breathing module and the chat advice on sleep boundaries to keep my motivation levels stable. I didn't burn out this time.",
      name: "Rohan Das",
      role: "NEET Top scorer"
    }
  ];

  return (
    <div className="relative min-h-screen bg-dark text-white overflow-hidden flex flex-col justify-between">
      {/* Top Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[55%] h-[55%] rounded-full bg-secondary/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-dark/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
              <Brain className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-base font-bold tracking-wider">
              MindMate <span className="text-secondary font-black">AI</span>
            </span>
          </div>
          <Button variant="secondary" size="sm" onClick={handleCTA}>
            {user ? 'Go to Dashboard' : 'Sign In'}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex flex-col items-center text-center gap-6">
        <BrainNetwork />
        <FloatingParticles />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-secondary-light tracking-wide animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5" />
          Empathetic AI Built For Competitive Exam Aspirants
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Conquer Your Exam Stress,<br />
          <span className="gradient-text">Protect Your Mental Space</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl font-medium">
          MindMate AI helps JEE, NEET, UPSC, and GATE aspirants track stress, log thoughts, receive empathetic cognitive reframing, and prevent burnout.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center w-full sm:w-auto">
          <Button variant="primary" size="lg" onClick={handleCTA} className="group relative overflow-hidden">
            Start Your Free Journey
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Button>
          <a href="#features" className="inline-flex items-center justify-center">
            <Button variant="ghost" size="lg">
              Explore Features
            </Button>
          </a>
        </div>

        {/* Feature Grid preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-5xl mt-16 text-left">
          <div className="flex flex-col gap-2 p-4 border border-white/5 rounded-2xl bg-white/2">
            <Zap className="w-5 h-5 text-secondary" />
            <h3 className="text-sm font-bold">Fast Sentiment Analysis</h3>
            <p className="text-xs text-slate-400">Extract triggers in 1 second.</p>
          </div>
          <div className="flex flex-col gap-2 p-4 border border-white/5 rounded-2xl bg-white/2">
            <Heart className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold">Empathetic Reframing</h3>
            <p className="text-xs text-slate-400">Turn negative thoughts to progress.</p>
          </div>
          <div className="flex flex-col gap-2 p-4 border border-white/5 rounded-2xl bg-white/2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold">Study-Rest Balancer</h3>
            <p className="text-xs text-slate-400">Keep burnout risk below danger level.</p>
          </div>
          <div className="flex flex-col gap-2 p-4 border border-white/5 rounded-2xl bg-white/2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold">100% Secure & Private</h3>
            <p className="text-xs text-slate-400">Your journals remain local.</p>
          </div>
        </div>
      </section>

      {/* Features Detail Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold">Built to Support Your High-Pressure Prep</h2>
          <p className="text-slate-400 text-sm mt-3">Competitive exams test your temperament as much as your knowledge. MindMate supports both.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} hoverEffect className="flex gap-5 items-start">
                <div className={`p-3.5 rounded-xl ${feat.color} flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold">Endorsed by Top Rankers</h2>
          <p className="text-slate-400 text-sm mt-3">See how other aspirants optimized their headspace for peak exam performance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="flex flex-col justify-between gap-6 relative bg-white/2">
              <p className="text-sm text-slate-300 italic leading-relaxed">
                "{t.quote}"
              </p>
              <div>
                <p className="text-sm font-bold text-white">{t.name}</p>
                <p className="text-xs text-secondary font-medium">{t.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-dark-lighter py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-slate-300">MindMate AI</span>
          </div>
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} MindMate AI. Empowering students, one breath at a time.
          </p>
          <div className="flex gap-4 text-xs text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
