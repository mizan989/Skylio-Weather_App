import { useState, useEffect, useCallback } from 'react';
import type { TempUnit, WindUnit, PrecipUnit, TimeFormat, UserPreferences } from '../types/weather';

const STORAGE_KEY = 'skylio-user-preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  tempUnit: 'celsius',
  windUnit: 'kmh',
  precipUnit: 'mm',
  timeFormat: '12h',
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          tempUnit: parsed.tempUnit === 'fahrenheit' ? 'fahrenheit' : 'celsius',
          windUnit: ['kmh', 'mph', 'ms'].includes(parsed.windUnit) ? parsed.windUnit : 'kmh',
          precipUnit: parsed.precipUnit === 'inch' ? 'inch' : 'mm',
          timeFormat: parsed.timeFormat === '24h' ? '24h' : '12h',
        };
      }
    } catch {
      // fallback to default
    }
    return DEFAULT_PREFERENCES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // ignore quota error
    }
  }, [preferences]);

  const setTempUnit = useCallback((tempUnit: TempUnit) => {
    setPreferences((prev) => ({ ...prev, tempUnit }));
  }, []);

  const setWindUnit = useCallback((windUnit: WindUnit) => {
    setPreferences((prev) => ({ ...prev, windUnit }));
  }, []);

  const setPrecipUnit = useCallback((precipUnit: PrecipUnit) => {
    setPreferences((prev) => ({ ...prev, precipUnit }));
  }, []);

  const setTimeFormat = useCallback((timeFormat: TimeFormat) => {
    setPreferences((prev) => ({ ...prev, timeFormat }));
  }, []);

  return {
    preferences,
    setTempUnit,
    setWindUnit,
    setPrecipUnit,
    setTimeFormat,
  };
}

// Transparent deterministic conversion helpers
export function formatWindSpeed(kmh: number | null | undefined, unit: WindUnit): { value: number; unit: string } {
  if (kmh == null || isNaN(kmh)) return { value: 0, unit: 'km/h' };
  switch (unit) {
    case 'mph':
      return { value: Math.round(kmh * 0.621371), unit: 'mph' };
    case 'ms':
      return { value: Math.round((kmh / 3.6) * 10) / 10, unit: 'm/s' };
    case 'kmh':
    default:
      return { value: Math.round(kmh), unit: 'km/h' };
  }
}

export function formatPrecipitation(mm: number | null | undefined, unit: PrecipUnit): { value: string; unit: string } {
  if (mm == null || isNaN(mm)) return { value: '0', unit: 'mm' };
  if (unit === 'inch') {
    const inches = mm * 0.0393701;
    return { value: inches < 0.1 && inches > 0 ? '<0.1' : inches.toFixed(1), unit: 'in' };
  }
  return { value: mm.toFixed(1), unit: 'mm' };
}
