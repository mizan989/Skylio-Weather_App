import React from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  CloudSun,
  Wind,
  Sliders,
  Settings,
  Search,
  MapPin,
  Loader2,
} from 'lucide-react';
import type {
  PrimaryDestination,
  TempUnit,
  WeatherLocation,
} from '../types/weather';

interface HeaderProps {
  currentDestination: PrimaryDestination;
  onSelectDestination: (dest: PrimaryDestination) => void;
  location: WeatherLocation;
  onOpenSearch: () => void;
  onLocate: () => void;
  locating: boolean;
  unit: TempUnit;
  onToggleUnit: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isLoading: boolean;
}

const NAV_ITEMS: { id: PrimaryDestination; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'weather', label: 'Weather', icon: CloudSun },
  { id: 'airquality', label: 'Air Quality', icon: Wind },
  { id: 'details', label: 'Details', icon: Sliders },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Header: React.FC<HeaderProps> = ({
  currentDestination,
  onSelectDestination,
  location,
  onOpenSearch,
  onLocate,
  locating,
  unit,
  onToggleUnit,
  onRefresh,
  isRefreshing,
  isLoading,
}) => {
  return (
    <header className="mb-6 flex flex-col gap-4 border-b border-white/[0.06] pb-4">
      {/* Top brand & actions bar */}
      <div className="flex items-center justify-between gap-3">
        {/* Brand Lockup */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectDestination('weather')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sky)] rounded-xl"
          aria-label="Skylio Home"
        >
          <img
            src="/logo.png"
            alt="Skylio Logo"
            className="size-9 rounded-xl object-contain shadow-[0_2px_12px_rgba(0,0,0,0.3)] border border-white/10"
            width={36}
            height={36}
          />
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl leading-none">
              Sky<span className="text-[var(--sky)]">lio</span>
            </span>
            <span className="font-mono text-[10px] text-white/40 tracking-wider uppercase mt-0.5">
              Precision Weather
            </span>
          </div>
        </motion.button>

        {/* Location chip (click to search) */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/80 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          title="Change location"
        >
          <Search size={13} className="text-[var(--sky)] shrink-0" />
          <span className="max-w-[180px] truncate font-medium">{location.name}</span>
          {location.country && (
            <span className="text-white/40 font-mono text-[11px] truncate">
              {location.country}
            </span>
          )}
          <span className="ml-1 text-[10px] font-mono text-white/30 border border-white/10 rounded px-1.5 py-0.5">
            /
          </span>
        </motion.button>

        {/* Quick controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* GPS Locate button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLocate}
            disabled={locating}
            title="Use current GPS location"
            aria-label="Use current GPS location"
            className="flex size-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/60 backdrop-blur-md transition-colors hover:border-white/20 hover:text-white disabled:opacity-40"
          >
            {locating ? (
              <Loader2 size={13} className="animate-spin text-[var(--sky)]" />
            ) : (
              <MapPin size={13} />
            )}
          </motion.button>

          {/* Unit toggle */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleUnit}
            title={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
            className="flex h-8 items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 font-mono text-xs font-medium text-white/70 backdrop-blur-md transition-colors hover:border-white/20 hover:text-white"
          >
            <span className={unit === 'celsius' ? 'text-white font-semibold' : 'text-white/40'}>
              °C
            </span>
            <span className="text-white/20">/</span>
            <span className={unit === 'fahrenheit' ? 'text-white font-semibold' : 'text-white/40'}>
              °F
            </span>
          </motion.button>

          {/* Refresh button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            disabled={isRefreshing || isLoading}
            title="Refresh weather data"
            aria-label="Refresh weather data"
            className="flex size-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/60 backdrop-blur-md transition-colors hover:border-white/20 hover:text-white disabled:opacity-40"
          >
            <RefreshCw
              size={13}
              className={isRefreshing || isLoading ? 'animate-spin text-[var(--sky)]' : ''}
            />
          </motion.button>
        </div>
      </div>

      {/* Desktop navigation tabs */}
      <nav
        aria-label="Primary navigation"
        className="hidden md:flex items-center gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1 backdrop-blur-xl"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentDestination === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectDestination(item.id)}
              className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-medium transition-all duration-200 focus:outline-none ${
                isActive
                  ? 'text-white'
                  : 'text-white/55 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 rounded-xl bg-white/[0.08] border border-white/[0.12] shadow-[0_2px_12px_rgba(0,0,0,0.2)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={14}
                className={`relative z-10 transition-colors ${
                  isActive ? 'text-[var(--sky)]' : 'text-white/50'
                }`}
              />
              <span className="relative z-10 font-mono tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;
