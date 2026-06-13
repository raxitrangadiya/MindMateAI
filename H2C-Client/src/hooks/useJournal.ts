import { useState, useEffect, useCallback } from 'react';
import { JournalEntry } from '../types';
import { api } from '../services/api';

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getJournalEntries();
      setEntries(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch journal entries');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitEntry = async (content: string): Promise<JournalEntry | null> => {
    setIsSubmitting(true);
    try {
      const entry = await api.submitJournalEntry(content);
      setEntries((prev) => [entry, ...prev]);
      setError(null);
      return entry;
    } catch (err: any) {
      setError(err.message || 'Failed to submit journal entry');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return {
    entries,
    isLoading,
    isSubmitting,
    error,
    submitEntry,
    fetchEntries,
  };
}
