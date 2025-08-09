'use client';

import React from 'react';
import { Brain, Target, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface WelcomeStepProps {
  onGetStarted: () => void;
  onSeeDemo: () => void;
  onShowDemo: () => void;
}

export function WelcomeStep({ onGetStarted, onSeeDemo, onShowDemo }: WelcomeStepProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Your Skills.
          <br />
          <span className="text-blue-600">Rwanda's Opportunities.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect your current skills directly to real job opportunities in Rwanda, 
          then get AI-powered learning paths to unlock better career outcomes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onGetStarted} size="lg" className="text-lg px-8 py-4">Get Started Free</Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4" onClick={onSeeDemo}>See Demo</Button>
          <Button variant="ghost" size="lg" className="text-lg px-8 py-4" onClick={onShowDemo}>Guided Demo (90s)</Button>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="text-center">
          <CardHeader>
            <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>Real Job Matching</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>See exactly what jobs you qualify for today in Rwanda with your current skills and realistic salary ranges.</CardDescription>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <CardTitle>Smart Gap Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>AI identifies 1-2 specific skills that unlock 2x better opportunities with clear learning paths and ROI.</CardDescription>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <CardTitle>Rwanda Job Market</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Real local employment data from kLab, SOLVIT Africa, and actual job postings - not generic global content.</CardDescription>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">🇷🇼 Rwanda Digital Job Market</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">High-Demand Skills</h4>
              <ul className="space-y-1 text-blue-800 text-sm">
                <li>• Web Development (70% of jobs)</li>
                <li>• Data Analysis (45% growth)</li>
                <li>• FinTech Integration (Mobile Money)</li>
                <li>• Digital Marketing (Remote-friendly)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">Market Opportunities</h4>
              <ul className="space-y-1 text-blue-800 text-sm">
                <li>• Entry-level: 150k - 400k RWF</li>
                <li>• Mid-level: 400k - 700k RWF</li>
                <li>• Senior-level: 700k+ RWF</li>
                <li>• Remote work: +200% since 2020</li>
              </ul>
            </div>
            <div className="md:col-span-2 text-xs text-blue-900/80 mt-2">Sources: kLab Rwanda, SOLVIT Africa, public job postings. Data is indicative for demo.</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
