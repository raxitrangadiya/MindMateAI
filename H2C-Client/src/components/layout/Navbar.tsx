import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { Menu, X, Brain, LayoutDashboard, BookOpen, MessageSquare, Target, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user, logout } = useUser();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Journal', path: '/journal', icon: BookOpen },
    { label: 'AI Coach', path: '/chat', icon: MessageSquare },
    { label: 'Action Plan', path: '/action-plan', icon: Target },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/10 bg-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-wider bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                MindMate <span className="text-secondary font-black">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/20 text-white border border-primary/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* User Status and Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-secondary font-medium uppercase tracking-widest">{user.examType} Aspirant</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-slate-400 hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 rounded-xl"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-dark/95 backdrop-blur-xl transition-all duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? 'bg-primary/25 text-white border border-primary/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            
            {/* Mobile User details & logout */}
            <div className="border-t border-white/10 mt-4 pt-4 px-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-secondary font-medium uppercase tracking-widest">{user.examType} Aspirant</p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
