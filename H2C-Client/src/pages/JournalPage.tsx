import React, { useState } from 'react';
import { useJournal } from '../hooks/useJournal';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { JournalAnalysisView } from './JournalAnalysis';
import { JournalHistory } from './JournalHistory';
import { PenTool, Brain, Calendar, Info, Smile } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { JournalEntry } from '../types';

export const JournalPage: React.FC = () => {
  const { entries, isSubmitting, submitEntry, isLoading } = useJournal();
  const [content, setContent] = useState('');
  const [activeAnalysis, setActiveAnalysis] = useState<JournalEntry | null>(null);
  const [warningMsg, setWarningMsg] = useState('');

  const handleJournalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 20) {
      setWarningMsg('Write at least 20 characters so MindMate AI can extract meaningful sentiment details.');
      return;
    }
    setWarningMsg('');
    const result = await submitEntry(content);
    if (result) {
      setActiveAnalysis(result);
      setContent('');
    }
  };

  const getMoodColor = (mood?: string) => {
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
    <PageContainer className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar: History Logs */}
      <div className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-bold text-white">Previous Journals</h2>
        </div>
        
        <JournalHistory
          entries={entries}
          isLoading={isLoading}
          onSelectEntry={(entry) => setActiveAnalysis(entry)}
          activeId={activeAnalysis?.id}
        />
      </div>

      {/* Main Panel: Editor & Active Analysis */}
      <div className="lg:col-span-8 flex flex-col gap-6 order-1 lg:order-2">
        {/* Editor Card */}
        <Card gradientBorder className="bg-dark-card/60">
          <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <PenTool className="w-5 h-5 text-primary-light" />
              <h1 className="text-xl font-extrabold text-white">Daily Vent / Journal</h1>
            </div>
            <Badge variant="primary">AI Cognitive Scrubber</Badge>
          </div>

          <form onSubmit={handleJournalSubmit} className="flex flex-col gap-4">
            <Textarea
              placeholder="How is your preparation going? Describe your emotions, mock test feelings, syllabus pressure, sleep quality, or any mental blocks you felt today..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (e.target.value.trim().length >= 20) setWarningMsg('');
              }}
              rows={6}
              disabled={isSubmitting}
            />

            {warningMsg && (
              <p className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                <Info className="w-4 h-4 flex-shrink-0" />
                {warningMsg}
              </p>
            )}

            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-slate-500 font-medium">
                {content.length} characters written
              </span>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                <Brain className="w-4 h-4 mr-2" />
                Analyze Stress & Mood
              </Button>
            </div>
          </form>
        </Card>

        {/* Selected Analysis Panel */}
        {activeAnalysis ? (
          <JournalAnalysisView entry={activeAnalysis} />
        ) : (
          <Card className="flex flex-col items-center justify-center p-12 text-center text-slate-500 gap-3 border-dashed border-white/10 bg-transparent">
            <Smile className="w-10 h-10 text-slate-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-400">No Analysis Loaded</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Write a new journal above or select a past log from the left sidebar to inspect cognitive distortions and stress recommendations.
              </p>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
