/**
 * Navbar component - Top navigation bar with menu trigger
 * Production-ready and 1:1 compatible with Next.js migration
 */

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

type NavbarProps = {
  onMenuOpen: () => void;
};

export default function Navbar({ onMenuOpen }: NavbarProps) {
  return (
    <Button
      size="lg"
      onClick={onMenuOpen}
      className="fixed top-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-2xl"
      aria-label="فتح القائمة"
    >
      <Menu className="w-7 h-7 text-white" />
    </Button>
  );
}
