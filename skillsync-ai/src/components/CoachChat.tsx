'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CoachChatProps {
  open: boolean;
  onClose: () => void;
  analysis: any;
  userSkills: UserSkill[];
}

export function CoachChat({ open, onClose, analysis, userSkills }: CoachChatProps) {
  const [role, setRole] = useState<'tutor' | 'coach' | 'mentor'>('coach');
  const [question, setQuestion] = useState('What should I do next to unlock the best job?');
  const [answer, setAnswer] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const ask = async () => {
    if (!userSkills || userSkills.length === 0) {
      setAnswer("Please add some skills first before asking the coach!");
      return;
    }
    try {
      setLoading(true);
      setAnswer(''); // Clear previous answer for new stream
      setSuggestions([]); // Clear previous suggestions

      const skillsList = userSkills.map(s => s.name.toLowerCase());

      // Create a deep copy of analysis and convert Date objects to ISO strings
      const serializableAnalysis = JSON.parse(JSON.stringify(analysis));
      if (serializableAnalysis && serializableAnalysis.lastAnalyzed) {
        serializableAnalysis.lastAnalyzed = new Date(serializableAnalysis.lastAnalyzed).toISOString();
      }
      if (serializableAnalysis && serializableAnalysis.userProfile && serializableAnalysis.userProfile.lastUpdated) {
        serializableAnalysis.userProfile.lastUpdated = new Date(serializableAnalysis.userProfile.lastUpdated).toISOString();
      }

      const res = await (await import('@/lib/services')).Services.coachChat(role, serializableAnalysis, question, skillsList);
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
            <div className="font-medium mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-blue-600">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 10.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75zm-3 0a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75zm-3.75 0a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
              {role.charAt(0).toUpperCase() + role.slice(1)}:
            </div>
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


