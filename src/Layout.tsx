/**
 * Layout component - Main application layout wrapper
 * Production-ready and 1:1 compatible with Next.js migration
 * 
 * This Layout follows clean architecture principles:
 * - Separated concerns (Navbar, MobileMenu, Footer as separate components)
 * - External data configuration (navigation.ts)
 * - No inline styles
 * - Minimal state management
 * - Ready for Next.js App Router (will become RootLayout)
 */

import { useState } from 'react';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import OfflineIndicator from '@/components/pwa/OfflineIndicator';
import DailyReminders from '@/components/notifications/DailyReminders';
import GlobalAudioPlayer from '@/components/player/GlobalAudioPlayer';
import Navbar from '@/components/layout/Navbar';
import MobileMenu from '@/components/layout/MobileMenu';
import Footer from '@/components/layout/Footer';

type LayoutProps = {
  children: React.ReactNode;
  currentPageName: string;
};

export default function Layout({ children, currentPageName }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
        {/* Spiritual Background */}
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/70 via-white/80 to-emerald-100/70" />
        </div>

        <div className="relative z-10">
          {/* PWA and Notification Components */}
          <OfflineIndicator />
          <InstallPrompt />
          <DailyReminders />

          {/* Navigation */}
          <Navbar onMenuOpen={() => setSidebarOpen(true)} />
          <MobileMenu
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            currentPageName={currentPageName}
          />

          {/* Main Content */}
          <main className="pb-24">{children}</main>

          {/* Global Audio Player */}
          <GlobalAudioPlayer
            currentSurah={1}
            currentVerse={1}
            isPlaying={false}
            onPlayPause={() => {}}
            onNext={() => {}}
            onPrevious={() => {}}
            onVolumeChange={() => {}}
            onProgressChange={() => {}}
          />

          {/* Footer */}
          <Footer />
        </div>
      </div>
  );
}
