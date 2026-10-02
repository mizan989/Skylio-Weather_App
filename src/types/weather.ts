export type TempUnit = 'celsius' | 'fahrenheit';
export type WindUnit = 'kmh' | 'mph' | 'ms';
export type PrecipUnit = 'mm' | 'inch';
export type TimeFormat = '12h' | '24h';

export interface UserPreferences {
  tempUnit: TempUnit;
  windUnit: WindUnit;
  precipUnit: PrecipUnit;
  timeFormat: TimeFormat;
}

export type PrimaryDestination = 'weather' | 'airquality' | 'details' | 'settings';
export type WeatherViewTab = 'overview' | 'hourly' | 'daily' | 'telemetry';

export interface GeocodeResult {
  id: number;
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface WeatherLocation {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface HourlyData {
  time: string[];
  temperature_2m: number[];
  apparent_temperature?: number[];
  weather_code: number[];
  precipitation_probability: number[];
  precipitation?: number[];
  relative_humidity_2m?: number[];
  wind_speed_10m?: number[];
  uv_index?: number[];
  visibility?: number[];
}

export interface DailyData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max?: number[];
  apparent_temperature_min?: number[];
  precipitation_probability_max: number[];
  precipitation_sum?: number[];
  uv_index_max?: number[];
  wind_speed_10m_max?: number[];
  wind_gusts_10m_max?: number[];
  sunrise: string[];
  sunset: string[];
  daylight_duration?: number[];
}

export interface CurrentData {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m?: number;
  pressure_msl: number;
  surface_pressure?: number;
  cloud_cover?: number;
  uv_index?: number;
  visibility?: number;
  dew_point_2m?: number;
  is_day: number;
  time: string;
}

export interface ForecastResponse {
  current: CurrentData;
  hourly: HourlyData;
  daily: DailyData;
  timezone: string;
  utc_offset_seconds: number;
}

export interface AirQualityCurrent {
  time: string;
  interval?: number;
  european_aqi?: number | null;
  us_aqi?: number | null;
  pm10?: number | null;
  pm2_5?: number | null;
  carbon_monoxide?: number | null;
  nitrogen_dioxide?: number | null;
  sulphur_dioxide?: number | null;
  ozone?: number | null;
}

export interface AirQualityHourly {
  time: string[];
  european_aqi?: (number | null)[];
  us_aqi?: (number | null)[];
  pm10?: (number | null)[];
  pm2_5?: (number | null)[];
  ozone?: (number | null)[];
  nitrogen_dioxide?: (number | null)[];
}

export interface AirQualityResponse {
  current: AirQualityCurrent;
  hourly: AirQualityHourly;
  current_units: Record<string, string>;
  timezone: string;
}
