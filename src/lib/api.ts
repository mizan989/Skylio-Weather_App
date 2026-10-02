import type {
  AirQualityResponse,
  ForecastResponse,
  GeocodeResult,
  TempUnit,
  WeatherLocation
} from '../types/weather';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export async function searchCities(query: string): Promise<GeocodeResult[]> {
  if (!query.trim()) return [];
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('City search failed');
  const data = await res.json();
  return data.results ?? [];
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeocodeResult | null> {
  // Primary: BigDataCloud free client reverse geocoding (fast, accurate, no auth needed)
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const name = data.city || data.locality || data.principalSubdivision || data.countryName || 'Your Location';
      const admin1 = data.principalSubdivision || undefined;
      const country = data.countryName || '';
      return {
        id: Math.round(lat * 10000 + lon),
        name,
        admin1,
        country,
        latitude: lat,
        longitude: lon,
        timezone: 'auto',
      };
    }
  } catch {
    // Fallback to OSM Nominatim
  }

  // Fallback 1: OpenStreetMap Nominatim
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`;
    const res = await fetch(osmUrl, {
      headers: { 'Accept-Language': 'en' },
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const name = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || addr.county || 'Your Location';
      return {
        id: Math.round(lat * 10000 + lon),
        name,
        admin1: addr.state || addr.region,
        country: addr.country || '',
        latitude: lat,
        longitude: lon,
        timezone: 'auto',
      };
    }
  } catch {
    // ignore
  }

  return null;
}

export async function ipGeolocate(): Promise<WeatherLocation | null> {
  try {
    const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client');
    if (res.ok) {
      const data = await res.json();
      if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        const name = data.city || data.locality || data.principalSubdivision || data.countryName || 'Local Region';
        return {
          name,
          admin1: data.principalSubdivision,
          country: data.countryName || '',
          latitude: data.latitude,
          longitude: data.longitude,
        };
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export async function fetchForecast(
  lat: number,
  lon: number,
  unit: TempUnit
): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'pressure_msl',
      'surface_pressure',
      'cloud_cover',
      'uv_index',
      'visibility',
      'dew_point_2m',
      'is_day',
    ].join(','),
    hourly: [
      'temperature_2m',
      'apparent_temperature',
      'weather_code',
      'precipitation_probability',
      'precipitation',
      'relative_humidity_2m',
      'wind_speed_10m',
      'uv_index',
      'visibility',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'precipitation_probability_max',
      'precipitation_sum',
      'uv_index_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'sunrise',
      'sunset',
      'daylight_duration',
    ].join(','),
    temperature_unit: unit,
    wind_speed_unit: 'kmh',
    timezone: 'auto',
    forecast_days: '7',
  });
  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) throw new Error('Forecast fetch failed');
  return res.json();
}

export async function fetchAirQuality(
  lat: number,
  lon: number
): Promise<AirQualityResponse> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: [
      'european_aqi',
      'us_aqi',
      'pm10',
      'pm2_5',
      'carbon_monoxide',
      'nitrogen_dioxide',
      'sulphur_dioxide',
      'ozone',
    ].join(','),
    hourly: [
      'european_aqi',
      'us_aqi',
      'pm10',
      'pm2_5',
      'ozone',
      'nitrogen_dioxide',
    ].join(','),
    timezone: 'auto',
    forecast_days: '2',
  });

  const res = await fetch(`${AIR_QUALITY_URL}?${params.toString()}`);
  if (!res.ok) throw new Error('Air quality fetch failed');
  return res.json();
}
