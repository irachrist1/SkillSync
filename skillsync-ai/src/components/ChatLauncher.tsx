'use client';

import React, { useEffect, useState } from 'react';
import { CoachChat } from '@/components/CoachChat';
import { LocalStorageManager } from '@/lib/localStorage';

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);

  useEffect(() => {
    if (!open) return;
    const a = LocalStorageManager.getAIAnalysis();
    setAnalysis(a);
  }, [open]);

  return (
    <>
      <button
        aria-label="Open Coach Chat"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-blue-600 text-white shadow-lg w-14 h-14 text-xl hover:bg-blue-700 focus:outline-none"
      >
        💬
      </button>
      <CoachChat open={open} onClose={() => setOpen(false)} analysis={analysis} />
    </>
  );
}


