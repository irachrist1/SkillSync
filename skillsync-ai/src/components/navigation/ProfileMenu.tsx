'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LocalStorageManager } from '@/lib/localStorage';
import { useRouter } from 'next/navigation';

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  const clearData = () => {
    if (confirm('Clear all local data (profile, analysis, preferences)?')) {
      LocalStorageManager.clearAllData();
      router.push('/?step=welcome');
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-xs font-semibold text-gray-700">PR</span>
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Profile"
          className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg py-1 text-sm"
        >
          <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={() => router.push('/?step=analysis')}>View Profile</button>
          <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={() => router.push('/?step=skills')}>Edit Profile</button>
          <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={() => router.push('/?step=analysis')}>Saved Analyses</button>
          <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={() => alert('Settings coming soon')}>Settings</button>
          <div className="border-t my-1"></div>
          <button className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50" onClick={clearData}>Clear Data</button>
        </div>
      )}
    </div>
  );
}


