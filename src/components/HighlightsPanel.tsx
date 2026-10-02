import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Wind, Sun, Sunrise, Sunset, Compass, Clock } from 'lucide-react';
import { getWindDirection, getBeaufortScale, getHumidityComfort, getUVDetails } from '../lib/weatherCodes';
import { formatSunTime, formatDaylightDuration } from '../lib/time';
import { formatWindSpeed } from '../hooks/usePreferences';
import type { CurrentData, DailyData, WindUnit, TimeFormat } from '../types/weather';

interface HighlightsPanelProps {
  current: CurrentData;
  daily: DailyData;
  windUnit?: WindUnit;
  timeFormat?: TimeFormat;
  timezone?: string;
}

export const HighlightsPanel: React.FC<HighlightsPanelProps> = ({
  current,
  daily,
  windUnit = 'kmh',
  timeFormat = '12h',
  timezone,
}) => {
  const windDir = getWindDirection(current.wind_direction_10m);
  const beaufort = getBeaufortScale(current.wind_speed_10m);
  const windFormatted = formatWindSpeed(current.wind_speed_10m, windUnit);
  const gustsFormatted = current.wind_gusts_10m
    ? formatWindSpeed(current.wind_gusts_10m, windUnit)
    : null;

  const uvVal = current.uv_index ?? daily.uv_index_max?.[0] ?? 0;
  const uvInfo = getUVDetails(uvVal);

  const comfort = getHumidityComfort(current.relative_humidity_2m, current.dew_point_2m);
  const sunriseStr = formatSunTime(daily.sunrise?.[0], timezone, timeFormat === '24h');
  const sunsetStr = formatSunTime(daily.sunset?.[0], timezone, timeFormat === '24h');
  const daylightStr = formatDaylightDuration(daily.daylight_duration?.[0]);

  return (
    <section aria-label="Today's Highlights" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-xs uppercase tracking-wider text-white/50">
          Today's Highlights
        </h3>
        <span className="font-mono text-[10px] text-white/35">Essential Observations</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Humidity & Dew Point */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-white/[0.08] bg-[#0E1524]/80 p-4 backdrop-blur-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-white/50">
            <span className="font-mono text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Droplets size={13} className="text-[var(--sky)]" />
              <span>Humidity</span>
            </span>
            <span className="font-mono text-[11px] text-white/60">{comfort.label}</span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl font-light text-white tabular-nums">
                {current.relative_humidity_2m}
              </span>
              <span className="font-mono text-xs text-white/40">%</span>
            </div>
            <p className="mt-1 text-xs text-white/60 leading-tight">
              {current.dew_point_2m !== undefined ? `Dew point at ${Math.round(current.dew_point_2m)}°` : comfort.description}
            </p>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--sky)] to-blue-400"
              style={{ width: `${Math.min(100, Math.max(0, current.relative_humidity_2m))}%` }}
            />
          </div>
        </motion.div>

        {/* 2. Wind & Direction */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-white/[0.08] bg-[#0E1524]/80 p-4 backdrop-blur-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-white/50">
            <span className="font-mono text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Wind size={13} className="text-[var(--sky)]" />
              <span>Wind</span>
            </span>
            <span className="font-mono text-xs font-medium text-white/70">{windDir.cardinal}</span>
          </div>

          <div className="my-3 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl font-light text-white tabular-nums">
                  {windFormatted.value}
                </span>
                <span className="font-mono text-xs text-white/40">{windFormatted.unit}</span>
              </div>
              <p className="mt-1 text-xs text-white/60 truncate">
                {beaufort.description}
              </p>
            </div>

            <div className="flex size-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03]">
              <motion.div
                animate={{ rotate: current.wind_direction_10m }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <Compass size={20} className="text-[var(--sky)]" />
              </motion.div>
            </div>
          </div>

          <div className="font-mono text-[11px] text-white/45">
            {gustsFormatted ? `Gusts up to ${gustsFormatted.value} ${gustsFormatted.unit}` : beaufort.description}
          </div>
        </motion.div>

        {/* 3. UV Index */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-white/[0.08] bg-[#0E1524]/80 p-4 backdrop-blur-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-white/50">
            <span className="font-mono text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sun size={13} className="text-amber-400" />
              <span>UV Index</span>
            </span>
            <span className="font-mono text-[11px]" style={{ color: uvInfo.color }}>
              {uvInfo.level}
            </span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl font-light text-white tabular-nums">
                {uvVal}
              </span>
              <span className="font-mono text-xs text-white/40">/ 11+</span>
            </div>
            <p className="mt-1 text-xs text-white/60 truncate">
              {uvInfo.advice}
            </p>
          </div>

          {/* Segmented UV gauge */}
          <div className="h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, (uvVal / 11) * 100)}%`,
                backgroundColor: uvInfo.color,
              }}
            />
          </div>
        </motion.div>

        {/* 4. Sun & Daylight */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-white/[0.08] bg-[#0E1524]/80 p-4 backdrop-blur-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-white/50">
            <span className="font-mono text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={13} className="text-[var(--gold)]" />
              <span>Solar Diurnal</span>
            </span>
            <span className="font-mono text-[11px] text-white/50">{daylightStr}</span>
          </div>

          <div className="my-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-7.5 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
                <Sunrise size={15} />
              </div>
              <div>
                <span className="font-mono text-xs text-white/45 block">Rise</span>
                <span className="font-mono text-sm font-medium text-white">{sunriseStr}</span>
              </div>
            </div>

            <div className="h-6 w-px bg-white/[0.08]" />

            <div className="flex items-center gap-2">
              <div className="flex size-7.5 items-center justify-center rounded-lg bg-orange-400/10 text-orange-300">
                <Sunset size={15} />
              </div>
              <div>
                <span className="font-mono text-xs text-white/45 block">Set</span>
                <span className="font-mono text-sm font-medium text-white">{sunsetStr}</span>
              </div>
            </div>
          </div>

          <div className="font-mono text-[11px] text-white/40">
            Daylight duration: {daylightStr}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HighlightsPanel;
