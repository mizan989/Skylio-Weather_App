import React from 'react';
import {
  Thermometer,
  Wind,
  Droplets,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck,
  FileText,
  Check
} from 'lucide-react';
import type { TempUnit, WindUnit, PrecipUnit, TimeFormat, UserPreferences } from '../types/weather';

interface SettingsViewProps {
  preferences: UserPreferences;
  onUpdateTempUnit: (unit: TempUnit) => void;
  onUpdateWindUnit: (unit: WindUnit) => void;
  onUpdatePrecipUnit: (unit: PrecipUnit) => void;
  onUpdateTimeFormat: (format: TimeFormat) => void;
  onOpenLegal: (tab: 'privacy' | 'terms') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  preferences,
  onUpdateTempUnit,
  onUpdateWindUnit,
  onUpdatePrecipUnit,
  onUpdateTimeFormat,
  onOpenLegal,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section
        aria-label="Application Settings"
        className="rounded-3xl border border-white/[0.08] bg-[#0E1524]/85 p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
          <img
            src="/logo.png"
            alt="Skylio"
            className="size-10 rounded-xl object-contain border border-white/10 shadow-sm"
          />
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Application Settings
            </h2>
            <p className="font-mono text-xs text-white/50 mt-0.5">
              Personalize units, formats, and explore application governance
            </p>
          </div>
        </div>

        {/* Units Configuration Grid */}
        <div className="mt-6 flex flex-col gap-5">
          {/* 1. Temperature Unit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-white/[0.04] text-[var(--sky)]">
                <Thermometer size={18} />
              </div>
              <div>
                <span className="font-medium text-sm text-white block">Temperature Scale</span>
                <span className="font-mono text-xs text-white/40">Select Celsius or Fahrenheit</span>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => onUpdateTempUnit('celsius')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
                  preferences.tempUnit === 'celsius'
                    ? 'bg-white/[0.1] text-white font-medium shadow-sm'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {preferences.tempUnit === 'celsius' && <Check size={12} />}
                <span>Celsius (°C)</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateTempUnit('fahrenheit')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
                  preferences.tempUnit === 'fahrenheit'
                    ? 'bg-white/[0.1] text-white font-medium shadow-sm'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {preferences.tempUnit === 'fahrenheit' && <Check size={12} />}
                <span>Fahrenheit (°F)</span>
              </button>
            </div>
          </div>

          {/* 2. Wind Speed Unit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-white/[0.04] text-[var(--sky)]">
                <Wind size={18} />
              </div>
              <div>
                <span className="font-medium text-sm text-white block">Wind Speed Unit</span>
                <span className="font-mono text-xs text-white/40">Kilometers per hour, miles per hour, or meters per second</span>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => onUpdateWindUnit('kmh')}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
                  preferences.windUnit === 'kmh'
                    ? 'bg-white/[0.1] text-white font-medium shadow-sm'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {preferences.windUnit === 'kmh' && <Check size={12} />}
                <span>km/h</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateWindUnit('mph')}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
                  preferences.windUnit === 'mph'
                    ? 'bg-white/[0.1] text-white font-medium shadow-sm'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {preferences.windUnit === 'mph' && <Check size={12} />}
                <span>mph</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateWindUnit('ms')}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
                  preferences.windUnit === 'ms'
                    ? 'bg-white/[0.1] text-white font-medium shadow-sm'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {preferences.windUnit === 'ms' && <Check size={12} />}
                <span>m/s</span>
              </button>
            </div>
          </div>

          {/* 3. Precipitation Unit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-white/[0.04] text-[var(--sky)]">
                <Droplets size={18} />
              </div>
              <div>
                <span className="font-medium text-sm text-white block">Precipitation Measurement</span>
                <span className="font-mono text-xs text-white/40">Millimeters or Inches</span>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => onUpdatePrecipUnit('mm')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
                  preferences.precipUnit === 'mm'
                    ? 'bg-white/[0.1] text-white font-medium shadow-sm'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {preferences.precipUnit === 'mm' && <Check size={12} />}
                <span>Millimeters (mm)</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdatePrecipUnit('inch')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
                  preferences.precipUnit === 'inch'
                    ? 'bg-white/[0.1] text-white font-medium shadow-sm'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {preferences.precipUnit === 'inch' && <Check size={12} />}
                <span>Inches (in)</span>
              </button>
            </div>
          </div>

          {/* 4. Time Format */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-white/[0.04] text-[var(--sky)]">
                <Clock size={18} />
              </div>
              <div>
                <span className="font-medium text-sm text-white block">Time Display Format</span>
                <span className="font-mono text-xs text-white/40">12-hour standard (AM/PM) or 24-hour military clock</span>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => onUpdateTimeFormat('12h')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
                  preferences.timeFormat === '12h'
                    ? 'bg-white/[0.1] text-white font-medium shadow-sm'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {preferences.timeFormat === '12h' && <Check size={12} />}
                <span>12-Hour</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateTimeFormat('24h')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
                  preferences.timeFormat === '24h'
                    ? 'bg-white/[0.1] text-white font-medium shadow-sm'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {preferences.timeFormat === '24h' && <Check size={12} />}
                <span>24-Hour</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Location Permissions & Help */}
      <section
        aria-label="Location Permissions & Help"
        className="rounded-3xl border border-white/[0.08] bg-[#0E1524]/85 p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
      >
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-4">
          <MapPin size={16} className="text-[var(--sky)]" />
          <h3 className="font-mono text-xs uppercase tracking-wider text-white/60">
            Location Permissions & Privacy
          </h3>
        </div>

        <div className="space-y-3 text-xs text-white/70 leading-relaxed font-sans">
          <p>
            Skylio accesses your device geolocation strictly when you press the GPS locate button. No tracking scripts or background tracking beacons are deployed.
          </p>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-white/60">
            <span className="font-semibold text-white/80 block mb-1">Permission Troubleshooting:</span>
            If geolocation fails, ensure you are browsing via HTTPS and that location access is allowed in your browser settings (look for the lock or site settings icon in the address bar).
          </div>
        </div>
      </section>

      {/* Data Attribution & Governance */}
      <section
        aria-label="Data Attribution & Legal Governance"
        className="rounded-3xl border border-white/[0.08] bg-[#0E1524]/85 p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
      >
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-4">
          <ShieldCheck size={16} className="text-[var(--sky)]" />
          <h3 className="font-mono text-xs uppercase tracking-wider text-white/60">
            Data Attribution & Governance
          </h3>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div>
              <span className="font-medium text-sm text-white block">Meteorological Telemetry Provider</span>
              <p className="font-mono text-xs text-white/50 mt-0.5">
                Weather forecasts, historical blends & air quality powered by Open-Meteo
              </p>
            </div>
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 font-mono text-xs text-white/80 hover:border-white/25 hover:text-white transition-colors self-start sm:self-auto"
            >
              <span>open-meteo.com</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-[var(--sky)]" />
                <div>
                  <span className="font-medium text-sm text-white block">Privacy Policy</span>
                  <span className="font-mono text-xs text-white/40">Zero telemetry, local storage</span>
                </div>
              </div>
              <ExternalLink size={13} className="text-white/30" />
            </button>

            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-amber-400" />
                <div>
                  <span className="font-medium text-sm text-white block">Terms of Service</span>
                  <span className="font-mono text-xs text-white/40">Permissive open source terms</span>
                </div>
              </div>
              <ExternalLink size={13} className="text-white/30" />
            </button>
          </div>
        </div>

        {/* Application details */}
        <div className="mt-6 border-t border-white/[0.06] pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-white/45">
          <span>Skylio Weather Instrument</span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/mizan989/skylio"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>Source Repository</span>
            </a>
            <span>•</span>
            <span>MIT License</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
