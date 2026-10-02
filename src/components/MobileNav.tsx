import React from 'react';
import { motion } from 'framer-motion';
import { CloudSun, Wind, Sliders, Settings } from 'lucide-react';
import type { PrimaryDestination } from '../types/weather';

interface MobileNavProps {
  currentDestination: PrimaryDestination;
  onSelectDestination: (dest: PrimaryDestination) => void;
}

const ITEMS: { id: PrimaryDestination; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'weather', label: 'Weather', icon: CloudSun },
  { id: 'airquality', label: 'Air Quality', icon: Wind },
  { id: 'details', label: 'Details', icon: Sliders },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const MobileNav: React.FC<MobileNavProps> = ({
  currentDestination,
  onSelectDestination,
}) => {
  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.08] bg-[#080C14]/90 backdrop-blur-2xl px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentDestination === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectDestination(item.id)}
              className={`relative flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium transition-colors ${
                isActive ? 'text-white' : 'text-white/45 hover:text-white/70'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActiveIndicator"
                  className="absolute -top-2 h-0.5 w-6 rounded-full bg-[var(--sky)] shadow-[0_0_8px_var(--sky)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon
                size={18}
                className={isActive ? 'text-[var(--sky)]' : 'text-white/40'}
              />
              <span className="font-mono tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
