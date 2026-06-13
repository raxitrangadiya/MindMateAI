import { useState, useEffect, useCallback } from 'react';
import { DashboardData, ActionPlan } from '../types';
import { api } from '../services/api';

export function useDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch both dashboard and action plan data
      const [dash, plan] = await Promise.all([
        api.getDashboardData(),
        api.getActionPlan(),
      ]);
      setDashboardData(dash);
      setActionPlan(plan);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    dashboardData,
    actionPlan,
    isLoading,
    error,
    refresh,
  };
}
