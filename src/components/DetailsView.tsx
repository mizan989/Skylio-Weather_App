import React, { useState } from 'react';
import {
  Gauge,
  Droplets,
  Wind,
  Sun
} from 'lucide-react';
import { getWindDirection, getBeaufortScale, getHumidityComfort, getUVDetails } from '../lib/weatherCodes';
import { formatSunTime, formatDaylightDuration } from '../lib/time';
import { formatWindSpeed, formatPrecipitation } from '../hooks/usePreferences';
import type { CurrentData, DailyData, TempUnit, WindUnit, PrecipUnit, TimeFormat, WeatherLocation } from '../types/weather';

interface DetailsViewProps {
  location: WeatherLocation;
  current: CurrentData;
  daily: DailyData;
  unit: TempUnit;
  windUnit?: WindUnit;
  precipUnit?: PrecipUnit;
  timeFormat?: TimeFormat;
  timezone?: string;
}

export const DetailsView: React.FC<DetailsViewProps> = ({
  location,
  current,
  daily,
  unit,
  windUnit = 'kmh',
  precipUnit = 'mm',
  timeFormat = '12h',
  timezone,
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'atmosphere' | 'wind' | 'solar' | 'precip'>('all');

  // Wind calculations
  const windDir = getWindDirection(current.wind_direction_10m);
  const beaufort = getBeaufortScale(current.wind_speed_10m);
  const windFormatted = formatWindSpeed(current.wind_speed_10m, windUnit);
  const gustsFormatted = current.wind_gusts_10m
    ? formatWindSpeed(current.wind_gusts_10m, windUnit)
    : null;

  // Atmospheric calculations
  const pressureMsl = Math.round(current.pressure_msl);
  const surfacePressure = current.surface_pressure ? Math.round(current.surface_pressure) : null;
  const dewPoint = current.dew_point_2m !== undefined ? Math.round(current.dew_point_2m) : null;
  const comfort = getHumidityComfort(current.relative_humidity_2m, current.dew_point_2m);
  const visibilityKm = current.visibility ? (current.visibility / 1000).toFixed(1) : '10.0';
  const visibilityMiles = current.visibility ? (current.visibility * 0.000621371).toFixed(1) : '6.2';
  const cloudCover = current.cloud_cover ?? 0;

  // Solar calculations
  const uvVal = current.uv_index ?? daily.uv_index_max?.[0] ?? 0;
  const uvInfo = getUVDetails(uvVal);
  const sunriseStr = formatSunTime(daily.sunrise?.[0], timezone, timeFormat === '24h');
  const sunsetStr = formatSunTime(daily.sunset?.[0], timezone, timeFormat === '24h');
  const daylightStr = formatDaylightDuration(daily.daylight_duration?.[0]);

  // Precipitation calculations
  const precipProb = daily.precipitation_probability_max?.[0] ?? 0;
  const precipSum = daily.precipitation_sum?.[0] ?? 0;
  const precipFormatted = formatPrecipitation(precipSum, precipUnit);

  return (
    <div className="flex flex-col gap-6">
      {/* Destination Header with category filter */}
      <section
        aria-label="Advanced Telemetry Overview"
        className="rounded-3xl border border-white/[0.08] bg-[#0E1524]/85 p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Meteorological Details
            </h2>
            <p className="mt-1 font-mono text-xs text-white/50">
              Detailed atmospheric telemetry & variables for {location.name}
            </p>
          </div>

          {/* Section filter pills */}
          <div className="flex flex-wrap items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
            {[
              { id: 'all', label: 'All Telemetry' },
              { id: 'atmosphere', label: 'Atmosphere' },
              { id: 'wind', label: 'Wind' },
              { id: 'solar', label: 'Solar' },
              { id: 'precip', label: 'Precipitation' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id as typeof activeSection)}
                className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-colors ${
                  activeSection === tab.id
                    ? 'bg-white/[0.1] text-white font-medium shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick synoptic summary row */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs text-white/70">
          <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-3">
            <span className="text-[10px] text-white/40 uppercase tracking-wider block">Pressure</span>
            <span className="text-lg font-light text-white tabular-nums">{pressureMsl} hPa</span>
          </div>
          <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-3">
            <span className="text-[10px] text-white/40 uppercase tracking-wider block">Dew Point</span>
            <span className="text-lg font-light text-white tabular-nums">{dewPoint !== null ? `${dewPoint}°` : '—'}</span>
          </div>
          <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-3">
            <span className="text-[10px] text-white/40 uppercase tracking-wider block">Cloud Cover</span>
            <span className="text-lg font-light text-white tabular-nums">{cloudCover}%</span>
          </div>
          <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-3">
            <span className="text-[10px] text-white/40 uppercase tracking-wider block">Visibility</span>
            <span className="text-lg font-light text-white tabular-nums">{visibilityKm} km</span>
          </div>
        </div>
      </section>

      {/* 1. Atmosphere Panel */}
      {(activeSection === 'all' || activeSection === 'atmosphere') && (
        <section
          aria-label="Atmosphere & Pressure Telemetry"
          className="rounded-3xl border border-white/[0.08] bg-[#0E1524]/85 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
        >
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-4">
            <Gauge size={16} className="text-[var(--sky)]" />
            <h3 className="font-mono text-xs uppercase tracking-wider text-white/60">
              Atmosphere & Barometrics
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <span className="font-mono text-xs text-white/45">Sea Level Pressure (MSL)</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="font-display text-3xl font-light text-white tabular-nums">
                  {pressureMsl}
                </span>
                <span className="font-mono text-xs text-white/40">hPa</span>
              </div>
              <p className="text-xs text-white/55 leading-tight">
                {pressureMsl > 1013 ? 'High pressure system promoting calm conditions.' : 'Lower barometric pressure area.'}
              </p>
            </div>

            {surfacePressure && (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <span className="font-mono text-xs text-white/45">Surface Pressure</span>
                <div className="my-2 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-light text-white tabular-nums">
                    {surfacePressure}
                  </span>
                  <span className="font-mono text-xs text-white/40">hPa</span>
                </div>
                <p className="text-xs text-white/55 leading-tight">
                  Measured directly at ground level elevation.
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <span className="font-mono text-xs text-white/45">Relative Humidity & Moisture</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="font-display text-3xl font-light text-white tabular-nums">
                  {current.relative_humidity_2m}
                </span>
                <span className="font-mono text-xs text-white/40">%</span>
              </div>
              <p className="text-xs text-white/55 leading-tight">
                {comfort.description}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <span className="font-mono text-xs text-white/45">Dew Point</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="font-display text-3xl font-light text-white tabular-nums">
                  {dewPoint !== null ? dewPoint : '—'}
                </span>
                <span className="font-mono text-xs text-white/40">°{unit === 'celsius' ? 'C' : 'F'}</span>
              </div>
              <p className="text-xs text-white/55 leading-tight">
                Temperature at which atmospheric vapor condenses into dew.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <span className="font-mono text-xs text-white/45">Cloud Cover Fraction</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="font-display text-3xl font-light text-white tabular-nums">
                  {cloudCover}
                </span>
                <span className="font-mono text-xs text-white/40">%</span>
              </div>
              <p className="text-xs text-white/55 leading-tight">
                {cloudCover < 20 ? 'Clear sky with minimal cloud coverage.' : cloudCover < 70 ? 'Partly cloudy sky conditions.' : 'Heavy overcast cloud blanket.'}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <span className="font-mono text-xs text-white/45">Horizontal Visibility</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="font-display text-3xl font-light text-white tabular-nums">
                  {visibilityKm}
                </span>
                <span className="font-mono text-xs text-white/40">km / {visibilityMiles} mi</span>
              </div>
              <p className="text-xs text-white/55 leading-tight">
                Maximum distance at which prominent objects can be seen.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 2. Wind Panel */}
      {(activeSection === 'all' || activeSection === 'wind') && (
        <section
          aria-label="Wind Dynamics Telemetry"
          className="rounded-3xl border border-white/[0.08] bg-[#0E1524]/85 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
        >
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-4">
            <Wind size={16} className="text-[var(--sky)]" />
            <h3 className="font-mono text-xs uppercase tracking-wider text-white/60">
              Wind Dynamics & Vectors
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <span className="font-mono text-xs text-white/45">Sustained Wind Speed</span>
              <div className="my-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-light text-white tabular-nums">
                  {windFormatted.value}
                </span>
                <span className="font-mono text-xs text-white/40">{windFormatted.unit}</span>
              </div>
              <div className="font-mono text-xs text-white/60">
                Direction: {windDir.cardinal} ({Math.round(current.wind_direction_10m)}°)
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <span className="font-mono text-xs text-white/45">Peak Wind Gusts</span>
              <div className="my-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-light text-white tabular-nums">
                  {gustsFormatted ? gustsFormatted.value : '—'}
                </span>
                <span className="font-mono text-xs text-white/40">{gustsFormatted ? gustsFormatted.unit : ''}</span>
              </div>
              <div className="font-mono text-xs text-white/60">
                10-meter level momentary maximum
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-white/45">Beaufort Force Scale</span>
                <div className="my-2">
                  <span className="font-display text-2xl font-normal text-white">
                    Beaufort Level {beaufort.level}
                  </span>
                </div>
              </div>
              <p className="text-xs text-white/60 leading-tight">
                {beaufort.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 3. Solar & Celestial Panel */}
      {(activeSection === 'all' || activeSection === 'solar') && (
        <section
          aria-label="Solar & Celestial Telemetry"
          className="rounded-3xl border border-white/[0.08] bg-[#0E1524]/85 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
        >
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-4">
            <Sun size={16} className="text-amber-400" />
            <h3 className="font-mono text-xs uppercase tracking-wider text-white/60">
              Solar & Celestial Metrics
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <span className="font-mono text-xs text-white/45">Solar UV Index (Peak)</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="font-display text-3xl font-light text-white tabular-nums">{uvVal}</span>
                <span className="font-mono text-xs" style={{ color: uvInfo.color }}>
                  ({uvInfo.level})
                </span>
              </div>
              <p className="text-xs text-white/55">{uvInfo.advice}</p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <span className="font-mono text-xs text-white/45">Sunrise Time</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="font-mono text-2xl font-light text-amber-300">{sunriseStr}</span>
              </div>
              <p className="text-xs text-white/55">Local solar elevation crossing 0°.</p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <span className="font-mono text-xs text-white/45">Sunset Time</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="font-mono text-2xl font-light text-orange-400">{sunsetStr}</span>
              </div>
              <p className="text-xs text-white/55">Evening solar dusk horizon entry.</p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:col-span-2 lg:col-span-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-mono text-xs text-white/45">Total Daylight Duration</span>
                  <div className="mt-1 font-mono text-xl font-medium text-white">
                    {daylightStr} of daylight
                  </div>
                </div>
                <p className="text-xs text-white/50 max-w-md">
                  Calculated from sunrise to sunset interval based on geographic latitude ({location.latitude.toFixed(2)}°) and solar declination.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Precipitation Panel */}
      {(activeSection === 'all' || activeSection === 'precip') && (
        <section
          aria-label="Precipitation Telemetry"
          className="rounded-3xl border border-white/[0.08] bg-[#0E1524]/85 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
        >
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-4">
            <Droplets size={16} className="text-[var(--sky)]" />
            <h3 className="font-mono text-xs uppercase tracking-wider text-white/60">
              Precipitation & Hydrology
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <span className="font-mono text-xs text-white/45">Precipitation Probability (Max)</span>
              <div className="my-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-light text-white tabular-nums">
                  {precipProb}
                </span>
                <span className="font-mono text-xs text-white/40">%</span>
              </div>
              <p className="text-xs text-white/60">
                Peak forecast likelihood of rain or snow within the 24-hour cycle.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <span className="font-mono text-xs text-white/45">Daily Expected Accumulation</span>
              <div className="my-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-light text-white tabular-nums">
                  {precipFormatted.value}
                </span>
                <span className="font-mono text-xs text-white/40">{precipFormatted.unit}</span>
              </div>
              <p className="text-xs text-white/60">
                Cumulative liquid precipitation sum across the 24-hour period.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default DetailsView;
