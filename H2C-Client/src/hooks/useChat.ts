import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { api } from '../services/api';

export function useChat() {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    let activeSession = sessionStorage.getItem('mindmate_chat_session_id');
    if (!activeSession) {
      activeSession = 'session-' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('mindmate_chat_session_id', activeSession);
    }
    setSessionId(activeSession);

    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const history = await api.getChatHistory(activeSession);
        if (history.length === 0) {
          // Put an initial greeting if empty
          const welcomeMessage: ChatMessage = {
            id: 'welcome-msg',
            sender: 'bot',
            text: "Hi there! I am your MindMate Wellness Coach. Exam prep can be a lot to handle—whether you are dealing with study stress, feeling low, or just want to organize your tasks, I am here to listen and help. What is on your mind today?",
            timestamp: new Date().toISOString(),
            suggestions: ["I am feeling stressed about exams", "Help me plan my revision schedule", "I feel exhausted"]
          };
          setMessages([welcomeMessage]);
          const storedSessionKey = `mindmate_chat_${activeSession}`;
          localStorage.setItem(storedSessionKey, JSON.stringify([welcomeMessage]));
        } else {
          setMessages(history);
        }
      } catch (err) {
        console.error('Failed to load chat history', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !sessionId) return;
    setIsSending(true);

    // Optimistically add user message
    const userMsg: ChatMessage = {
      id: 'optimistic-user-' + Date.now(),
      sender: 'user',
      text: content,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await api.sendChatMessage(content, sessionId);
      setMessages(response.messages);
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setIsSending(false);
    }
  };

  const clearChat = () => {
    if (!sessionId) return;
    const storedSessionKey = `mindmate_chat_${sessionId}`;
    localStorage.removeItem(storedSessionKey);
    const welcomeMessage: ChatMessage = {
      id: 'welcome-msg',
      sender: 'bot',
      text: "Hi there! I am your MindMate Wellness Coach. Exam prep can be a lot to handle—whether you are dealing with study stress, feeling low, or just want to organize your tasks, I am here to listen and help. What is on your mind today?",
      timestamp: new Date().toISOString(),
      suggestions: ["I am feeling stressed about exams", "Help me plan my revision schedule", "I feel exhausted"]
    };
    setMessages([welcomeMessage]);
    localStorage.setItem(storedSessionKey, JSON.stringify([welcomeMessage]));
  };

  return {
    messages,
    isLoading,
    isSending,
    sendMessage,
    clearChat,
  };
}
