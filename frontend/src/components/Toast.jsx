import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-neutral-950 text-white px-4 py-3 rounded-2xl shadow-xl border border-neutral-800 flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
      {toast.type === 'error' ? (
        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
      ) : (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      )}
      <span>{toast.message}</span>
    </div>
  );
}
