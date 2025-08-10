'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { LocalStorageManager } from '@/lib/localStorage';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  useEffect(() => { setCourses(LocalStorageManager.listCourses()); }, []);

  return (
    <Suspense fallback={null}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Your Courses</h1>
          <Link href="/?step=analysis" className="text-blue-600 hover:underline">← Back to Analysis</Link>
        </div>
        {courses.length === 0 ? (
          <div className="text-gray-600">No courses yet. Generate one from the Analysis page.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {courses.map((c) => (
              <Link key={c.id} href={`/courses/${c.id}`} className="border rounded p-4 hover:bg-gray-50">
                <div className="font-semibold text-gray-900">{c.course?.title || c.targetSkill}</div>
                <div className="text-sm text-gray-600">{new Date(c.createdAt).toLocaleString()}</div>
                <div className="mt-2 text-xs text-gray-500">{c.course?.duration}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Suspense>
  );
}


