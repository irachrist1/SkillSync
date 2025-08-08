'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const links = [
  { name: 'Home', step: 'welcome' },
  { name: 'Skills', step: 'skills' },
  { name: 'Analysis', step: 'analysis' },
];

export function NavigationMenu() {
  const searchParams = useSearchParams();
  const current = searchParams.get('step') || 'welcome';

  return (
    <nav className="hidden md:flex items-center gap-2 ml-4" aria-label="Primary">
      {links.map((l) => {
        const active = current === l.step;
        return (
          <Link
            key={l.step}
            href={{ pathname: '/', query: { step: l.step } }}
            className={`px-3 py-2 rounded-md text-sm ${
              active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {l.name}
          </Link>
        );
      })}
      <Link
        href={{ pathname: '/', query: { step: 'skills' } }}
        className="ml-2 px-3 py-2 rounded-md text-sm border hover:bg-gray-100"
        aria-label="Open Skill Picker"
      >
        Skill Picker
      </Link>
    </nav>
  );
}


