import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, ArrowUp, ArrowDown, Droplets, Wind } from 'lucide-react';
import { getWeatherMeta } from '../lib/weatherCodes';
import { formatLocalTime } from '../lib/time';
import { getDeterministicWeatherSummary } from '../lib/weatherSummary';
import { formatWindSpeed } from '../hooks/usePreferences';
import type { CurrentData, DailyData, TempUnit, WindUnit, WeatherLocation, TimeFormat } from '../types/weather';

interface HeroWeatherCardProps {
  location: WeatherLocation;
  current: CurrentData;
  daily: DailyData;
  unit: TempUnit;
  windUnit?: WindUnit;
  timeFormat?: TimeFormat;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  timezone?: string;
}

export default function HeroWeatherCard({
  location,
  current,
  daily,
  unit,
  windUnit = 'kmh',
  timeFormat = '12h',
  isBookmarked,
  onToggleBookmark,
  timezone,
}: HeroWeatherCardProps) {
  const isDay = current.is_day === 1;
  const { label, icon: WeatherIcon } = getWeatherMeta(current.weather_code, isDay);
  const [localTime, setLocalTime] = useState<string>('');

  useEffect(() => {
    function updateClock() {
      setLocalTime(formatLocalTime(new Date(), timezone, timeFormat === '24h'));
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [timezone, timeFormat]);

  const high = daily.temperature_2m_max[0] ?? current.temperature_2m;
  const low = daily.temperature_2m_min[0] ?? current.temperature_2m;
  const precipProb = daily.precipitation_probability_max?.[0] ?? 0;
  const windInfo = formatWindSpeed(current.wind_speed_10m, windUnit);
  const insight = getDeterministicWeatherSummary(current, daily);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Current Weather Overview"
      className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E1524]/85 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-colors md:p-8"
    >
      {/* Subtle atmospheric gradient glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[var(--sky)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />

      {/* Header: Location & Time */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {location.name}
            </h2>
            {location.country && (
              <span className="font-mono text-xs text-white/50">
                {location.country}
              </span>
            )}
          </div>
          <p className="mt-1 font-mono text-xs text-white/45">
            Local time {localTime || '—'}
          </p>
        </div>

        {/* Save Bookmark */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleBookmark}
          aria-label={isBookmarked ? 'Remove saved location' : 'Save location'}
          className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 font-mono text-xs text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
        >
          {isBookmarked ? (
            <>
              <BookmarkCheck size={13} className="text-[var(--gold)]" />
              <span className="text-white/90">Saved</span>
            </>
          ) : (
            <>
              <Bookmark size={13} className="text-white/40" />
              <span>Save</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Center Row: Temperature & Condition */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-baseline">
            <span className="font-display text-7xl font-light tracking-tighter text-white sm:text-8xl lg:text-9xl tabular-nums">
              {Math.round(current.temperature_2m)}
            </span>
            <span className="font-display text-3xl sm:text-4xl font-extralight text-white/40 ml-1">
              °{unit === 'celsius' ? 'C' : 'F'}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-4 font-mono text-xs text-white/60">
            <span>
              Feels like <span className="text-white font-medium">{Math.round(current.apparent_temperature)}°</span>
            </span>
            <span className="flex items-center gap-1 text-white/75">
              <ArrowUp size={12} className="text-white/40" />
              <span>{Math.round(high)}°</span>
              <span className="text-white/30">/</span>
              <ArrowDown size={12} className="text-white/40" />
              <span>{Math.round(low)}°</span>
            </span>
          </div>
        </div>

        {/* Condition presentation */}
        <div className="flex items-center sm:flex-col sm:items-end gap-3 pb-1">
          <div className="flex size-14 sm:size-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-[var(--sky)] shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <WeatherIcon size={36} strokeWidth={1.4} />
          </div>
          <div className="flex flex-col sm:text-right">
            <span className="text-base sm:text-lg font-medium tracking-tight text-white">
              {label}
            </span>
            <span className="font-mono text-xs text-white/45">
              Current Condition
            </span>
          </div>
        </div>
      </div>

      {/* Atmospheric Insight Strip (Deterministic) */}
      <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-[var(--sky)]/20 bg-[var(--sky)]/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--sky)]">
              {insight.headline}
            </span>
            <span className="text-xs text-white/80">
              {insight.detail}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-white/50 shrink-0">
            <span className="flex items-center gap-1">
              <Droplets size={12} className="text-[var(--sky)]" />
              <span>Rain {precipProb}%</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Wind size={12} className="text-white/40" />
              <span>{windInfo.value} {windInfo.unit}</span>
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
