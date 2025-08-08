'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CourseOutlineProps {
  course: {
    title: string;
    duration: string;
    modules: { title: string; lessons: { title: string; resource: string }[] }[];
    project: { title: string; brief: string };
  } | null;
}

export function CourseOutline({ course }: CourseOutlineProps) {
  if (!course) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{course.title} • {course.duration}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {course.modules?.map((m, i) => (
            <div key={i} className="border-l-4 border-purple-500 pl-4">
              <div className="font-semibold text-gray-900 mb-2">Module {i+1}: {m.title}</div>
              <ul className="space-y-1 text-sm">
                {m.lessons?.map((l, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span>
                      <span className="font-medium">{l.title}:</span>
                      {' '}<a className="text-blue-600 hover:underline" href={l.resource} target="_blank" rel="noreferrer">{l.resource}</a>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="p-3 bg-gray-50 rounded border">
          <div className="font-semibold mb-1">Capstone Project: {course.project?.title}</div>
          <div className="text-gray-700 text-sm whitespace-pre-wrap">{course.project?.brief}</div>
        </div>
      </CardContent>
    </Card>
  );
}


