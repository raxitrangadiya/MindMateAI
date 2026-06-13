import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/20 rounded-full"></div>
        {/* Spinning Arc */}
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        {/* Inner Pulsing Dot */}
        <div className="absolute top-4 left-4 w-8 h-8 bg-secondary/30 rounded-full animate-pulse"></div>
      </div>
      <p className="text-sm text-slate-400 font-medium animate-pulse">Decoding wellness vibes...</p>
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="glass-card p-6 w-full animate-pulse flex flex-col gap-4">
      <div className="h-6 bg-white/10 rounded-lg w-1/3"></div>
      <div className="space-y-2.5">
        <div className="h-4 bg-white/5 rounded w-full"></div>
        <div className="h-4 bg-white/5 rounded w-5/6"></div>
        <div className="h-4 bg-white/5 rounded w-4/5"></div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="h-5 bg-white/10 rounded-full w-16"></div>
        <div className="h-5 bg-white/10 rounded-full w-20"></div>
      </div>
    </div>
  );
};

export const SkeletonGraph: React.FC = () => {
  return (
    <div className="glass-card p-6 w-full animate-pulse flex flex-col gap-4">
      <div className="h-6 bg-white/10 rounded-lg w-1/4"></div>
      <div className="h-48 bg-white/5 rounded-xl w-full flex items-end justify-between p-4 gap-2">
        <div className="h-16 bg-white/10 rounded w-full"></div>
        <div className="h-32 bg-white/10 rounded w-full"></div>
        <div className="h-24 bg-white/10 rounded w-full"></div>
        <div className="h-40 bg-white/10 rounded w-full"></div>
        <div className="h-28 bg-white/10 rounded w-full"></div>
        <div className="h-36 bg-white/10 rounded w-full"></div>
      </div>
    </div>
  );
};
