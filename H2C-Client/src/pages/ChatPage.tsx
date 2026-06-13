import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MessageSquare, Send, Sparkles, Trash2, Bot, User as UserIcon } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';

export const ChatPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { messages, isLoading, isSending, sendMessage, clearChat } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isSending) return;
    sendMessage(suggestion);
  };

  return (
    <PageContainer className="flex flex-col h-[calc(100vh-140px)] max-w-5xl">
      <Card gradientBorder className="flex flex-col h-full bg-dark-card/60 p-0 overflow-hidden relative">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-white/1 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                AI Mind Wellness Coach
              </h1>
              <p className="text-xs text-slate-400">Tailored support for competitive exam prep</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-slate-400 hover:text-danger hover:bg-danger/10 border border-transparent rounded-xl flex items-center gap-1.5"
            title="Reset conversation history"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>

        {/* Message Bubble List */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 flex flex-col">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                  isBot ? 'self-start' : 'self-end flex-row-reverse'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md ${
                    isBot 
                      ? 'bg-gradient-to-tr from-primary to-secondary text-white' 
                      : 'bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  {isBot ? <Bot className="w-4.5 h-4.5" /> : <UserIcon className="w-4.5 h-4.5" />}
                </div>

                {/* Message block */}
                <div className="flex flex-col gap-1.5">
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isBot
                        ? 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                        : 'bg-primary text-white rounded-tr-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  
                  {/* Message suggestions/prompt chips only on last bot message */}
                  {isBot && msg.suggestions && msg.suggestions.length > 0 && msg.id === messages[messages.length - 1]?.id && !isSending && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[11px] font-bold text-secondary-light transition-all"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isSending && (
            <div className="flex gap-3 self-start max-w-[75%]">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 rounded-tl-none flex items-center justify-center gap-1.5 h-9">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-white/1 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Ask anything about stress management, planning study sprints, sleep reframing..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!input.trim() || isSending}
              className="py-3 px-4 rounded-xl flex-shrink-0 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
        </div>
      </Card>
    </PageContainer>
  );
};
