import { useCallback, useEffect, useState } from 'react';
import { fetchAirQuality } from '../lib/api';
import type { AirQualityResponse, WeatherLocation } from '../types/weather';

interface UseAirQualityResult {
  data: AirQualityResponse | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useAirQuality(location: WeatherLocation | null): UseAirQualityResult {
  const [data, setData] = useState<AirQualityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!location) {
      setData(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchAirQuality(location.latitude, location.longitude)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? 'Failed to retrieve air quality data');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [location, tick]);

  return { data, loading, error, reload };
}
