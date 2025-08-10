'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface GuidedDemoProps {
  onClose: () => void;
}

export function GuidedDemo({ onClose }: GuidedDemoProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, 3)), 2000);
    return () => clearInterval(id);
  }, []);

  const steps = [
    { title: '1) Select Skills', text: 'Pick your current skills. We map them to real Rwanda jobs.' },
    { title: '2) Analyze', text: 'AI identifies gaps, salary impact, and market insights.' },
    { title: '3) Learning Path', text: 'Follow a practical path with local resources (kLab/SOLVIT).' },
    { title: 'Complete', text: 'You can now run a real analysis or share your plan.' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="text-sm text-gray-500 mb-2">Guided Demo (90s)</div>
        <h3 className="text-xl font-semibold mb-1">{steps[step]!.title}</h3>
        <p className="text-gray-700 mb-4">{steps[step]!.text}</p>
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">Step {step + 1} / {steps.length}</div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}


