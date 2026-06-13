import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  gradientBorder?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  gradientBorder = false,
  className = '',
  ...props
}) => {
  const baseClass = gradientBorder 
    ? 'gradient-border rounded-2xl p-6 shadow-xl'
    : hoverEffect 
      ? 'glass-card-hover p-6'
      : 'glass-card p-6';

  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {children}
    </div>
  );
};
