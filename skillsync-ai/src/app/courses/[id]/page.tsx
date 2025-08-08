'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { LocalStorageManager } from '@/lib/localStorage';
import { CourseOutline } from '@/components/CourseOutline';

export default function CourseDetailPage() {
  const params = useParams();
  const id = useMemo(() => String(params?.id || ''), [params]);
  const [courseDoc, setCourseDoc] = useState<any | null>(null);

  useEffect(() => {
    if (id) setCourseDoc(LocalStorageManager.getCourse(id));
  }, [id]);

  if (!id) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Course</h1>
        <Link href="/courses" className="text-blue-600 hover:underline">← All Courses</Link>
      </div>
      {!courseDoc ? (
        <div className="text-gray-600">Course not found.</div>
      ) : (
        <CourseOutline course={courseDoc.course} />
      )}
    </div>
  );
}


