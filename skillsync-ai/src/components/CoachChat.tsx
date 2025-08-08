'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CoachChatProps {
  open: boolean;
  onClose: () => void;
  analysis: any;
}

export function CoachChat({ open, onClose, analysis }: CoachChatProps) {
  const [role, setRole] = useState<'tutor' | 'coach' | 'mentor'>('coach');
  const [question, setQuestion] = useState('What should I do next to unlock the best job?');
  const [answer, setAnswer] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const ask = async () => {
    try {
      setLoading(true);
      const res = await (await import('@/lib/services')).Services.coachChat(role, analysis, question);
      setAnswer(res.chat?.answer || '');
      setSuggestions(res.chat?.follow_ups || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Ask Your Career Coach</h3>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
        </div>

        <div className="flex gap-2 mb-3 text-sm">
          {(['tutor','coach','mentor'] as const).map(r => (
            <button key={r} className={`px-3 py-1 rounded border ${role===r?'bg-blue-600 text-white':'bg-white'}`} onClick={() => setRole(r)}>{r}</button>
          ))}
        </div>

        <textarea
          className="w-full border rounded p-2 text-sm mb-2"
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button onClick={ask} disabled={loading}>{loading ? 'Thinking…' : 'Ask'}</Button>

        {answer && (
          <div className="mt-4 p-3 bg-gray-50 rounded border text-sm">
            <div className="font-medium mb-1">Coach:</div>
            <div className="text-gray-800">{answer}</div>
            {suggestions.length>0 && (
              <div className="mt-2">
                <div className="text-gray-600 mb-1">Try asking:</div>
                <ul className="list-disc ml-5 space-y-1">
                  {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


