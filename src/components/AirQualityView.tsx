import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wind,
  AlertTriangle,
  Info,
  Loader2
} from 'lucide-react';
import { formatHourLabel } from '../lib/time';
import type { AirQualityResponse, WeatherLocation, TimeFormat } from '../types/weather';

interface AirQualityViewProps {
  location: WeatherLocation;
  data: AirQualityResponse | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  timeFormat?: TimeFormat;
}

type AqiSystem = 'us' | 'european';

// Standard US EPA AQI categories
function getUsAqiCategory(aqi: number | null | undefined): { label: string; color: string; bg: string; description: string } {
  if (aqi == null) return { label: 'Unavailable', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.1)', description: 'Air quality measurements currently unavailable.' };
  if (aqi <= 50) return { label: 'Good', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', description: 'Air quality is satisfactory, and air pollution poses little or no risk.' };
  if (aqi <= 100) return { label: 'Moderate', color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.12)', description: 'Air quality is acceptable; however, very sensitive individuals may experience mild symptoms.' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: '#F97316', bg: 'rgba(249, 115, 22, 0.12)', description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)', description: 'Some members of the general public may experience health effects; sensitive members may experience more serious effects.' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.12)', description: 'Health alert: The risk of health effects is increased for everyone.' };
  return { label: 'Hazardous', color: '#7E22CE', bg: 'rgba(126, 34, 206, 0.15)', description: 'Health warning of emergency conditions: Everyone is more likely to be affected.' };
}

// Standard European EAQI categories
function getEuropeanAqiCategory(aqi: number | null | undefined): { label: string; color: string; bg: string; description: string } {
  if (aqi == null) return { label: 'Unavailable', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.1)', description: 'European AQI measurements unavailable.' };
  if (aqi <= 20) return { label: 'Good', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', description: 'Air quality meets strict European clean air standards.' };
  if (aqi <= 40) return { label: 'Fair', color: '#34D399', bg: 'rgba(52, 211, 153, 0.12)', description: 'Air quality is acceptable with low pollutant concentrations.' };
  if (aqi <= 60) return { label: 'Moderate', color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.12)', description: 'Moderate pollution levels observed.' };
  if (aqi <= 80) return { label: 'Poor', color: '#F97316', bg: 'rgba(249, 115, 22, 0.12)', description: 'High concentration of atmospheric pollutants.' };
  if (aqi <= 100) return { label: 'Very Poor', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)', description: 'Very high pollution concentrations affecting air quality.' };
  return { label: 'Extremely Poor', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.15)', description: 'Critical air pollution levels observed.' };
}

export const AirQualityView: React.FC<AirQualityViewProps> = ({
  location,
  data,
  loading,
  error,
  onRefresh,
  timeFormat = '12h',
}) => {
  const [system, setSystem] = useState<AqiSystem>('us');

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="size-6 animate-spin text-[var(--sky)] mb-3" />
        <p className="font-mono text-xs text-white/50">
          Retrieving Open-Meteo air quality measurements for {location.name}...
        </p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="rounded-3xl border border-rose-500/20 bg-rose-950/20 p-8 text-center text-xs font-mono text-rose-200">
        <AlertTriangle className="size-6 text-rose-400 mx-auto mb-2" />
        <p className="text-sm font-sans font-medium text-white mb-1">
          Air Quality Data Unavailable
        </p>
        <p className="text-rose-300/80 mb-4">{error}</p>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-full border border-rose-400/30 bg-white/5 px-4 py-1.5 text-white hover:bg-white/10"
        >
          Retry
        </button>
      </div>
    );
  }

  const current = data?.current;
  const usAqi = current?.us_aqi;
  const euAqi = current?.european_aqi;
  const usCategory = getUsAqiCategory(usAqi);
  const euCategory = getEuropeanAqiCategory(euAqi);

  const activeCategory = system === 'us' ? usCategory : euCategory;
  const activeValue = system === 'us' ? usAqi : euAqi;
  const maxValue = system === 'us' ? 500 : 100;
  const progressPercent = activeValue != null ? Math.min(100, Math.max(5, (activeValue / maxValue) * 100)) : 0;

  // Pollutant items list
  const pollutants = [
    {
      id: 'pm2_5',
      name: 'PM2.5',
      subtitle: 'Fine inhalable particles',
      value: current?.pm2_5,
      unit: 'μg/m³',
      threshold: current?.pm2_5 != null ? (current.pm2_5 <= 12 ? 'Good' : current.pm2_5 <= 35 ? 'Moderate' : current.pm2_5 <= 55 ? 'Elevated' : 'High') : '—',
      info: 'Microscopic particles with diameter ≤ 2.5 micrometers able to travel deep into respiratory tract.',
    },
    {
      id: 'pm10',
      name: 'PM10',
      subtitle: 'Inhalable particulate matter',
      value: current?.pm10,
      unit: 'μg/m³',
      threshold: current?.pm10 != null ? (current.pm10 <= 54 ? 'Good' : current.pm10 <= 154 ? 'Moderate' : 'High') : '—',
      info: 'Inhalable dust, pollen, and combustion particles with diameter ≤ 10 micrometers.',
    },
    {
      id: 'ozone',
      name: 'Ozone (O₃)',
      subtitle: 'Ground-level photochemical ozone',
      value: current?.ozone,
      unit: 'μg/m³',
      threshold: current?.ozone != null ? (current.ozone <= 54 ? 'Good' : current.ozone <= 124 ? 'Moderate' : 'High') : '—',
      info: 'Secondary pollutant formed by atmospheric reactions in sunlight.',
    },
    {
      id: 'nitrogen_dioxide',
      name: 'Nitrogen Dioxide (NO₂)',
      subtitle: 'Combustion & vehicle emissions',
      value: current?.nitrogen_dioxide,
      unit: 'μg/m³',
      threshold: current?.nitrogen_dioxide != null ? (current.nitrogen_dioxide <= 53 ? 'Good' : current.nitrogen_dioxide <= 100 ? 'Moderate' : 'High') : '—',
      info: 'Emitted primarily from motor vehicles, energy generation, and heating.',
    },
    {
      id: 'sulphur_dioxide',
      name: 'Sulphur Dioxide (SO₂)',
      subtitle: 'Industrial & power plant emissions',
      value: current?.sulphur_dioxide,
      unit: 'μg/m³',
      threshold: current?.sulphur_dioxide != null ? (current.sulphur_dioxide <= 35 ? 'Good' : current.sulphur_dioxide <= 75 ? 'Moderate' : 'High') : '—',
      info: 'Produced by industrial fuel combustion and mineral processing.',
    },
    {
      id: 'carbon_monoxide',
      name: 'Carbon Monoxide (CO)',
      subtitle: 'Incomplete combustion gas',
      value: current?.carbon_monoxide,
      unit: 'μg/m³',
      threshold: current?.carbon_monoxide != null ? (current.carbon_monoxide <= 4400 ? 'Normal' : 'Elevated') : '—',
      info: 'Colorless, odorless gas generated from incomplete fuel combustion.',
    },
  ];

  // Hourly AQI forecast trend (first 24h)
  const hourlyTimes = data?.hourly.time.slice(0, 24) ?? [];
  const hourlyValues = system === 'us'
    ? data?.hourly.us_aqi?.slice(0, 24) ?? []
    : data?.hourly.european_aqi?.slice(0, 24) ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Hero: Overall AQI Indicator */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        aria-label="Air Quality Index Overview"
        className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E1524]/85 p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Wind size={18} className="text-[var(--sky)]" />
              <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-white">
                Air Quality Index
              </h2>
            </div>
            <p className="mt-1 font-mono text-xs text-white/50">
              Source: Open-Meteo Air Quality Engine • {location.name}
            </p>
          </div>

          {/* Standard index selector */}
          <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSystem('us')}
              className={`rounded-lg px-3 py-1 text-xs font-mono transition-colors ${
                system === 'us'
                  ? 'bg-white/[0.1] text-white font-medium shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              US EPA AQI
            </button>
            <button
              type="button"
              onClick={() => setSystem('european')}
              className={`rounded-lg px-3 py-1 text-xs font-mono transition-colors ${
                system === 'european'
                  ? 'bg-white/[0.1] text-white font-medium shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              European EAQI
            </button>
          </div>
        </div>

        {/* Index Value & Status Display */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-baseline gap-4">
            <span className="font-display text-6xl sm:text-7xl font-light text-white tabular-nums">
              {activeValue != null ? Math.round(activeValue) : '—'}
            </span>
            <div className="flex flex-col">
              <span
                className="inline-block rounded-md px-2.5 py-1 text-xs font-mono font-medium uppercase tracking-wider self-start"
                style={{ backgroundColor: activeCategory.bg, color: activeCategory.color }}
              >
                {activeCategory.label}
              </span>
              <span className="mt-1 font-mono text-[11px] text-white/40">
                {system === 'us' ? '0–500 Index Scale' : '0–100+ Index Scale'}
              </span>
            </div>
          </div>

          {/* Descriptive health advice */}
          <div className="max-w-md rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs text-white/70 leading-relaxed">
            <p className="font-medium text-white/90 mb-1">Health Guidance:</p>
            <p>{activeCategory.description}</p>
          </div>
        </div>

        {/* Proportional Level Bar */}
        <div className="mt-6">
          <div className="h-2 w-full rounded-full bg-white/[0.08] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: activeCategory.color,
              }}
            />
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10px] text-white/40">
            <span>Good (0)</span>
            <span>Moderate ({system === 'us' ? '100' : '50'})</span>
            <span>Unhealthy ({system === 'us' ? '200' : '80'})</span>
            <span>Hazardous ({system === 'us' ? '300+' : '100+'})</span>
          </div>
        </div>
      </motion.section>

      {/* 24-Hour Trend Chart */}
      {hourlyTimes.length > 0 && hourlyValues.length > 0 && (
        <section
          aria-label="24-Hour Air Quality Trend"
          className="rounded-3xl border border-white/[0.08] bg-[#0E1524]/85 p-5 sm:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-white/50">
              24-Hour Air Quality Trend
            </h3>
            <span className="font-mono text-[11px] text-white/40">
              Hourly {system === 'us' ? 'US AQI' : 'European EAQI'}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scroll-smooth">
            {hourlyTimes.map((timeStr, idx) => {
              const val = hourlyValues[idx];
              const cat = system === 'us' ? getUsAqiCategory(val) : getEuropeanAqiCategory(val);
              const label = formatHourLabel(timeStr, data?.timezone, timeFormat === '24h');
              const barHeight = val != null ? Math.min(100, Math.max(12, (val / (system === 'us' ? 250 : 80)) * 100)) : 10;

              return (
                <div
                  key={timeStr}
                  className="flex min-w-[50px] flex-col items-center justify-end gap-1.5 rounded-xl border border-white/[0.04] bg-white/[0.015] p-2 hover:border-white/10"
                >
                  <span className="font-mono text-[11px] font-medium text-white/80 tabular-nums">
                    {val != null ? Math.round(val) : '—'}
                  </span>
                  <div className="h-16 w-3 rounded-full bg-white/[0.06] flex items-end overflow-hidden">
                    <div
                      className="w-full rounded-full transition-all duration-500"
                      style={{ height: `${barHeight}%`, backgroundColor: cat.color }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-white/40 mt-1">
                    {idx === 0 ? 'Now' : label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6 Pollutants Detailed Grid */}
      <section aria-label="Key Atmospheric Pollutants" className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs uppercase tracking-wider text-white/50">
            Key Pollutants Concentration
          </h3>
          <span className="font-mono text-[11px] text-white/35">
            Unit: Micrograms per cubic meter (μg/m³)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {pollutants.map((pollutant) => (
            <motion.div
              key={pollutant.id}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-white/[0.08] bg-[#0E1524]/80 p-4 backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs font-semibold text-white tracking-wide">
                    {pollutant.name}
                  </h4>
                  <span className="font-mono text-[10px] rounded px-1.5 py-0.5 border border-white/10 text-white/60">
                    {pollutant.threshold}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-white/40 mt-0.5">
                  {pollutant.subtitle}
                </p>

                <div className="my-3 flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-light text-white tabular-nums">
                    {pollutant.value != null ? (typeof pollutant.value === 'number' ? pollutant.value.toFixed(1) : pollutant.value) : '—'}
                  </span>
                  <span className="font-mono text-xs text-white/40">
                    {pollutant.unit}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-white/55 leading-relaxed border-t border-white/[0.04] pt-2 mt-1">
                {pollutant.info}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Standards Disclaimer & Transparency Notice */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4 text-xs font-mono text-white/45 flex items-start gap-2.5">
        <Info size={16} className="text-white/40 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Air Quality metrics are calculated via Open-Meteo Air Quality numerical model outputs. Indices are presented under their respective official calculation frameworks (US EPA AQI & European EAQI). Values represent regional atmospheric dispersion models and are not synthetic or interpolated.
        </p>
      </div>
    </div>
  );
};

export default AirQualityView;
