import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { NavigationMenu } from '@/components/navigation/NavigationMenu';
import { ProfileMenu } from '@/components/navigation/ProfileMenu';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ChatLauncher } from '@/components/ChatLauncher';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SkillSync AI - Rwanda Skills-to-Jobs Matcher',
  description: 'Connect your current skills directly to Rwanda job opportunities and get personalized learning paths to unlock better career outcomes.',
  keywords: 'Rwanda jobs, skills assessment, career development, learning paths, digital skills, job matching',
  authors: [{ name: 'SkillSync Team' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'SkillSync AI - Rwanda Skills-to-Jobs Matcher',
    description: 'Connect your skills to real job opportunities in Rwanda',
    url: 'https://skillsync.rw',
    siteName: 'SkillSync AI',
    locale: 'en_RW',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillSync AI - Rwanda Skills-to-Jobs Matcher',
    description: 'Connect your skills to real job opportunities in Rwanda',
  },
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-40">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Link href={{ pathname: '/', query: { step: 'welcome' } }} className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">SS</span>
                        </div>
                        <div>
                          <span className="text-lg font-bold text-gray-900 leading-none">SkillSync AI</span>
                          <p className="text-[11px] text-gray-600">Rwanda Skills-to-Jobs Matcher</p>
                        </div>
                      </Link>
                    </div>
                    <NavigationMenu />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="hidden sm:flex text-sm text-gray-600">
                      🇷🇼 Rwanda Job Market
                    </div>
                    <ProfileMenu />
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">SS</span>
                      </div>
                      <span className="font-semibold text-gray-900">SkillSync AI</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Connecting Rwanda's talent with digital opportunities through AI-powered career intelligence.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">For Job Seekers</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Skills Assessment</li>
                      <li>• Job Matching</li>
                      <li>• Learning Paths</li>
                      <li>• Salary Insights</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Rwanda Focus</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Local Job Market Data</li>
                      <li>• kLab Partnership</li>
                      <li>• SOLVIT Integration</li>
                      <li>• Mobile-First Design</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t pt-8 mt-8 text-center text-sm text-gray-500">
                  <p>
                    &copy; 2025 SkillSync AI. Built for Rwanda's digital future.
                  </p>
                  <p className="mt-2">
                    Powered by Google Gemini AI • Data from Rwanda Job Market Analysis 
                  </p>
                </div>
              </div>
            </footer>
          </div>
          <ChatLauncher />
        </ErrorBoundary>
      </body>
    </html>
  );
}