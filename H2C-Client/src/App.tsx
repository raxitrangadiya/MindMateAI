import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useUser } from './hooks/useUser';
import { Navbar } from './components/layout/Navbar';
import { Alert } from './components/ui/Alert';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Lazy load Pages
const LandingPage = lazy(() => import('./components/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const JournalPage = lazy(() => import('./pages/JournalPage').then(m => ({ default: m.JournalPage })));
const ChatPage = lazy(() => import('./pages/ChatPage').then(m => ({ default: m.ChatPage })));
const ActionPlanPage = lazy(() => import('./pages/ActionPlanPage').then(m => ({ default: m.ActionPlanPage })));

// Layout Wrapper
const DashboardLayout: React.FC = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between">
      <div>
        <Alert />
        <Navbar />
        <Suspense fallback={<div className="p-8"><LoadingSpinner /></div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

// Public Route Wrapper (prevent logged-in users from seeing Landing or Auth screens)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-dark flex items-center justify-center"><LoadingSpinner /></div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
          <Route path="/onboarding" element={<Navigate to="/login" replace />} />

          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/action-plan" element={<ActionPlanPage />} />
          </Route>

          {/* Fallback Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
