'use client';

import React, { useState } from 'react';
import { CoachChat } from '@/components/CoachChat';
import { UserSkill } from '@/types';

export function ChatLauncher({ userSkills, aiAnalysis }: { userSkills: UserSkill[], aiAnalysis: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label="Open Coach Chat"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-blue-600 text-white shadow-lg w-14 h-14 text-xl hover:bg-blue-700 focus:outline-none"
      >
        💬
      </button>
      <CoachChat open={open} onClose={() => setOpen(false)} analysis={aiAnalysis} userSkills={userSkills} />
    </>
  );
}


