'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Code } from 'lucide-react';

interface LearningPathProps {
  learningPath: {
    skill: string;
    resource: string;
    project: string;
  }[];
}

export function LearningPath({ learningPath }: LearningPathProps) {
  if (!learningPath || learningPath.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📚 Your Personalized Learning Path</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {learningPath.map((item, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.skill}</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800">Learning Resource</h4>
                  <a href={item.resource} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {item.resource}
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Code className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800">Project to Solidify Your Knowledge</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{item.project}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}