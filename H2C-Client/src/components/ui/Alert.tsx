import React, { useState } from 'react';
import { Phone, X, ShieldAlert } from 'lucide-react';

export const Alert: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="w-full bg-danger/10 border-b border-danger/30 text-rose-200 px-4 py-3 relative transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-danger animate-pulse flex-shrink-0" />
          <span className="text-sm font-medium">
            <strong>Need urgent help?</strong> If you are feeling overwhelmed, you are not alone. Please reach out to student helpline centers.
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="tel:919152987821"
            className="flex items-center gap-1.5 px-3 py-1 bg-danger/20 hover:bg-danger/35 border border-danger/30 rounded-lg text-xs font-bold text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            Kiran: 1800-599-0019
          </a>
          <a
            href="tel:912227546669"
            className="flex items-center gap-1.5 px-3 py-1 bg-danger/20 hover:bg-danger/35 border border-danger/30 rounded-lg text-xs font-bold text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            AASRA: 91-9820466726
          </a>
          <button
            onClick={() => setIsOpen(false)}
            className="text-rose-300 hover:text-white transition-colors absolute right-4 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0"
            aria-label="Close helpline banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
