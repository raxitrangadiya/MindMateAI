import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const styles = {
    primary: 'bg-primary/20 text-primary-light border border-primary/30',
    secondary: 'bg-secondary/20 text-secondary border border-secondary/30',
    success: 'bg-success/20 text-emerald-400 border border-success/30',
    warning: 'bg-warning/20 text-amber-400 border border-warning/30',
    danger: 'bg-danger/20 text-rose-400 border border-danger/30',
    info: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide capitalize ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
