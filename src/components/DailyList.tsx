import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Droplets, Wind, Sun, Sunrise, Sunset } from 'lucide-react';
import { getWeatherMeta, getUVDetails } from '../lib/weatherCodes';
import { formatDayLabel, formatSunTime } from '../lib/time';
import { formatWindSpeed, formatPrecipitation } from '../hooks/usePreferences';
import type { DailyData, WindUnit, PrecipUnit, TimeFormat } from '../types/weather';

interface DailyListProps {
  daily: DailyData;
  timezone?: string;
  windUnit?: WindUnit;
  precipUnit?: PrecipUnit;
  timeFormat?: TimeFormat;
}

export default function DailyList({
  daily,
  timezone,
  windUnit = 'kmh',
  precipUnit = 'mm',
  timeFormat = '12h',
}: DailyListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const allMin = Math.min(...daily.temperature_2m_min);
  const allMax = Math.max(...daily.temperature_2m_max);
  const range = allMax - allMin || 1;

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section
      aria-label="7-Day Synoptic Forecast"
      className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E1524]/85 p-5 sm:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
        <div>
          <h3 className="font-mono text-xs uppercase tracking-wider text-white/50">
            7-Day Synoptic Matrix
          </h3>
          <p className="mt-0.5 font-mono text-[11px] text-white/35">
            Extended range & daily weather outlook
          </p>
        </div>
        <span className="font-mono text-[10px] text-white/30 hidden sm:inline">
          Click row to expand details
        </span>
      </div>

      <div className="mt-2 divide-y divide-white/[0.04]">
        {daily.time.map((date, i) => {
          const isToday = i === 0;
          const { day } = formatDayLabel(date, timezone, isToday);
          const { label, icon: Icon } = getWeatherMeta(daily.weather_code[i] ?? 0, true);
          const lo = daily.temperature_2m_min[i];
          const hi = daily.temperature_2m_max[i];
          const barStart = ((lo - allMin) / range) * 100;
          const barWidth = Math.max(8, ((hi - lo) / range) * 100);
          const precipProb = daily.precipitation_probability_max[i];
          const precipSum = daily.precipitation_sum ? daily.precipitation_sum[i] : 0;
          const precipFormatted = formatPrecipitation(precipSum, precipUnit);
          const maxWind = daily.wind_speed_10m_max
            ? formatWindSpeed(daily.wind_speed_10m_max[i], windUnit)
            : null;
          const maxGusts = daily.wind_gusts_10m_max
            ? formatWindSpeed(daily.wind_gusts_10m_max[i], windUnit)
            : null;
          const uvMax = daily.uv_index_max ? daily.uv_index_max[i] : null;
          const uvInfo = uvMax !== null ? getUVDetails(uvMax) : null;
          const sunriseStr = formatSunTime(daily.sunrise?.[i], timezone, timeFormat === '24h');
          const sunsetStr = formatSunTime(daily.sunset?.[i], timezone, timeFormat === '24h');
          const isExpanded = expandedIndex === i;

          return (
            <div key={date} className="transition-colors">
              <button
                type="button"
                onClick={() => toggleExpand(i)}
                aria-expanded={isExpanded}
                className={`flex w-full items-center gap-2 sm:gap-3 py-3 text-left transition-all duration-200 rounded-xl px-2 sm:px-3 ${
                  isExpanded
                    ? 'bg-white/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.2)]'
                    : 'hover:bg-white/[0.025]'
                }`}
              >
                {/* Day label */}
                <span
                  className={`w-12 sm:w-16 shrink-0 font-mono text-xs ${
                    isToday ? 'text-[var(--sky)] font-semibold' : 'text-white/80'
                  }`}
                >
                  {day}
                </span>

                {/* Weather icon & label */}
                <div className="flex w-24 sm:w-36 shrink-0 items-center gap-2">
                  <Icon size={16} strokeWidth={1.5} className="shrink-0 text-[var(--sky)]" />
                  <span className="truncate text-xs text-white/70 font-normal">{label}</span>
                </div>

                {/* Rain probability */}
                <div className="w-10 shrink-0 text-center">
                  {precipProb > 10 ? (
                    <span className="font-mono text-[11px] text-[var(--sky)] font-medium">
                      {precipProb}%
                    </span>
                  ) : (
                    <span className="font-mono text-[11px] text-white/20">•</span>
                  )}
                </div>

                {/* Low temp */}
                <span className="w-6 sm:w-8 shrink-0 text-right font-mono text-xs text-white/50 tabular-nums">
                  {Math.round(lo)}°
                </span>

                {/* Scaled bar */}
                <div className="relative mx-1 sm:mx-2 h-1.5 flex-1 rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className="absolute h-full rounded-full"
                    style={{
                      left: `${barStart}%`,
                      width: `${barWidth}%`,
                      background: 'linear-gradient(90deg, #70B8FF, #FFD166)',
                    }}
                  />
                </div>

                {/* High temp */}
                <span className="w-6 sm:w-8 shrink-0 font-mono text-xs text-white/90 tabular-nums font-medium text-right">
                  {Math.round(hi)}°
                </span>

                <div className="shrink-0 text-white/30 ml-1">
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={13} />
                  </motion.div>
                </div>
              </button>

              {/* Expandable day drawer */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="my-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 sm:p-4 text-xs font-mono">
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-white/70">
                        {maxWind && (
                          <div className="flex items-center gap-1.5">
                            <Wind size={13} className="text-[var(--sky)]" />
                            <span>
                              Wind {maxWind.value} {maxWind.unit}{' '}
                              {maxGusts ? `(${maxGusts.value}g)` : ''}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5">
                          <Droplets size={13} className="text-[var(--sky)]" />
                          <span>Precip {precipFormatted.value} {precipFormatted.unit}</span>
                        </div>

                        {uvInfo && (
                          <div className="flex items-center gap-1.5">
                            <Sun size={13} style={{ color: uvInfo.color }} />
                            <span>UV {uvMax} ({uvInfo.level})</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Sunrise size={12} className="text-amber-300" />
                            <span>{sunriseStr}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Sunset size={12} className="text-orange-400" />
                            <span>{sunsetStr}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
