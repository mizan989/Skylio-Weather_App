import {
  Sun, Moon, CloudSun, CloudMoon, Cloudy,
  CloudFog, CloudDrizzle, CloudRain, CloudSnow,
  CloudLightning, CloudHail, type LucideIcon,
} from 'lucide-react';

export interface WeatherMeta {
  label: string;
  description: string;
  icon: LucideIcon;
}

// WMO weather interpretation codes -> label + description + icon
const CODES: Record<number, { label: string; description: string; day: LucideIcon; night: LucideIcon }> = {
  0:  { label: 'Clear Sky', description: 'Completely clear sky with abundant sunshine', day: Sun, night: Moon },
  1:  { label: 'Mainly Clear', description: 'Mostly clear skies with fleeting high clouds', day: CloudSun, night: CloudMoon },
  2:  { label: 'Partly Cloudy', description: 'Scattered clouds with intermittent sunshine', day: CloudSun, night: CloudMoon },
  3:  { label: 'Overcast', description: 'Thick, continuous cloud cover across the horizon', day: Cloudy, night: Cloudy },
  45: { label: 'Fog', description: 'Dense atmospheric fog reducing visibility', day: CloudFog, night: CloudFog },
  48: { label: 'Depositing Rime Fog', description: 'Freezing fog forming delicate ice crystals', day: CloudFog, night: CloudFog },
  51: { label: 'Light Drizzle', description: 'Fine, gentle mist precipitation', day: CloudDrizzle, night: CloudDrizzle },
  53: { label: 'Moderate Drizzle', description: 'Steady fine precipitation', day: CloudDrizzle, night: CloudDrizzle },
  55: { label: 'Dense Drizzle', description: 'Heavy drizzle with reduced visibility', day: CloudDrizzle, night: CloudDrizzle },
  56: { label: 'Light Freezing Drizzle', description: 'Supercooled drizzle freezing on contact', day: CloudDrizzle, night: CloudDrizzle },
  57: { label: 'Dense Freezing Drizzle', description: 'Freezing drizzle with icy accumulation', day: CloudDrizzle, night: CloudDrizzle },
  61: { label: 'Slight Rain', description: 'Gentle, light rain showers', day: CloudRain, night: CloudRain },
  63: { label: 'Moderate Rain', description: 'Steady, continuous rainfall', day: CloudRain, night: CloudRain },
  65: { label: 'Heavy Rain', description: 'Intense, heavy downpour', day: CloudRain, night: CloudRain },
  66: { label: 'Light Freezing Rain', description: 'Cold rain creating slippery glazed surfaces', day: CloudRain, night: CloudRain },
  67: { label: 'Heavy Freezing Rain', description: 'Severe freezing rain with glaze icing', day: CloudRain, night: CloudRain },
  71: { label: 'Slight Snow Fall', description: 'Gentle snow flurries floating down', day: CloudSnow, night: CloudSnow },
  73: { label: 'Moderate Snow Fall', description: 'Steady snowfall blanketing the ground', day: CloudSnow, night: CloudSnow },
  75: { label: 'Heavy Snow Fall', description: 'Substantial, intense blizzard conditions', day: CloudSnow, night: CloudSnow },
  77: { label: 'Snow Grains', description: 'Crisp tiny frozen white grains', day: CloudSnow, night: CloudSnow },
  80: { label: 'Slight Rain Showers', description: 'Passing light rain showers', day: CloudRain, night: CloudRain },
  81: { label: 'Moderate Rain Showers', description: 'Notable passing precipitation', day: CloudRain, night: CloudRain },
  82: { label: 'Violent Rain Showers', description: 'Sudden, torrential shower bursts', day: CloudRain, night: CloudRain },
  85: { label: 'Slight Snow Showers', description: 'Scattered winter flurries', day: CloudSnow, night: CloudSnow },
  86: { label: 'Heavy Snow Showers', description: 'Passing heavy snow squalls', day: CloudSnow, night: CloudSnow },
  95: { label: 'Thunderstorm', description: 'Active thunder, lightning, and rain', day: CloudLightning, night: CloudLightning },
  96: { label: 'Thunderstorm with Slight Hail', description: 'Thunderstorm with small ice pellets', day: CloudHail, night: CloudHail },
  99: { label: 'Severe Thunderstorm with Hail', description: 'Intense storm with dangerous large hail', day: CloudHail, night: CloudHail },
};

export function getWeatherMeta(code: number, isDay: boolean): WeatherMeta {
  const entry = CODES[code];
  if (!entry) {
    return {
      label: 'Unknown',
      description: 'Atmospheric condition code not cataloged',
      icon: isDay ? CloudSun : CloudMoon,
    };
  }
  return {
    label: entry.label,
    description: entry.description,
    icon: isDay ? entry.day : entry.night,
  };
}

// Broad condition family, used to pick the horizon-gradient palette and atmospheric theme
export type ConditionFamily = 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm';

export function getConditionFamily(code: number): ConditionFamily {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2 || code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 67) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 95) return 'storm';
  return 'clear';
}

// Cardinal direction from wind degrees
export function getWindDirection(deg: number): { label: string; cardinal: string } {
  const directions = [
    { label: 'North', cardinal: 'N' },
    { label: 'North-Northeast', cardinal: 'NNE' },
    { label: 'Northeast', cardinal: 'NE' },
    { label: 'East-Northeast', cardinal: 'ENE' },
    { label: 'East', cardinal: 'E' },
    { label: 'East-Southeast', cardinal: 'ESE' },
    { label: 'Southeast', cardinal: 'SE' },
    { label: 'South-Southeast', cardinal: 'SSE' },
    { label: 'South', cardinal: 'S' },
    { label: 'South-Southwest', cardinal: 'SSW' },
    { label: 'Southwest', cardinal: 'SW' },
    { label: 'West-Southwest', cardinal: 'WSW' },
    { label: 'West', cardinal: 'W' },
    { label: 'West-Northwest', cardinal: 'WNW' },
    { label: 'Northwest', cardinal: 'NW' },
    { label: 'North-Northwest', cardinal: 'NNW' },
  ];
  const idx = Math.round(deg / 22.5) % 16;
  return directions[idx];
}

// UV Index interpretation
export interface UVDetails {
  level: string;
  advice: string;
  color: string;
  fraction: number; // 0 to 1 scale for gauges
}

export function getUVDetails(uv: number = 0): UVDetails {
  if (uv < 3) {
    return {
      level: 'Low',
      advice: 'Minimal sun protection needed. Safe outdoors.',
      color: '#4ADE80',
      fraction: Math.min(1, uv / 12),
    };
  }
  if (uv < 6) {
    return {
      level: 'Moderate',
      advice: 'Wear sunglasses & SPF 30+ if outdoors for long periods.',
      color: '#FACC15',
      fraction: Math.min(1, uv / 12),
    };
  }
  if (uv < 8) {
    return {
      level: 'High',
      advice: 'Seek shade during midday. Hat & sunscreen recommended.',
      color: '#FB923C',
      fraction: Math.min(1, uv / 12),
    };
  }
  if (uv < 11) {
    return {
      level: 'Very High',
      advice: 'Extra protection required. Avoid direct sun 10am - 4pm.',
      color: '#F87171',
      fraction: Math.min(1, uv / 12),
    };
  }
  return {
    level: 'Extreme',
    advice: 'Take all precautions. Unprotected skin can burn quickly.',
    color: '#C084FC',
    fraction: 1,
  };
}

// Beaufort scale evaluation
export function getBeaufortScale(kmh: number): { level: number; description: string } {
  if (kmh < 1) return { level: 0, description: 'Calm air' };
  if (kmh <= 5) return { level: 1, description: 'Light air' };
  if (kmh <= 11) return { level: 2, description: 'Light breeze' };
  if (kmh <= 19) return { level: 3, description: 'Gentle breeze' };
  if (kmh <= 28) return { level: 4, description: 'Moderate breeze' };
  if (kmh <= 38) return { level: 5, description: 'Fresh breeze' };
  if (kmh <= 49) return { level: 6, description: 'Strong breeze' };
  if (kmh <= 61) return { level: 7, description: 'High wind' };
  if (kmh <= 74) return { level: 8, description: 'Gale' };
  if (kmh <= 88) return { level: 9, description: 'Strong gale' };
  if (kmh <= 102) return { level: 10, description: 'Storm' };
  if (kmh <= 117) return { level: 11, description: 'Violent storm' };
  return { level: 12, description: 'Hurricane force' };
}

// Humidity comfort level
export function getHumidityComfort(rh: number, dewPoint?: number): { label: string; description: string } {
  if (dewPoint !== undefined) {
    if (dewPoint < 10) return { label: 'Dry & Crisp', description: 'Low moisture, refreshing feel' };
    if (dewPoint <= 16) return { label: 'Comfortable', description: 'Ideal human comfort zone' };
    if (dewPoint <= 20) return { label: 'Humid', description: 'Noticeable moisture in the air' };
    if (dewPoint <= 24) return { label: 'Muggy', description: 'Very sticky and oppressive' };
    return { label: 'Severely Oppressive', description: 'Extremely tropical and damp' };
  }
  if (rh < 30) return { label: 'Dry', description: 'Low humidity level' };
  if (rh <= 60) return { label: 'Comfortable', description: 'Pleasant atmospheric balance' };
  if (rh <= 80) return { label: 'Humid', description: 'Moisture in the air' };
  return { label: 'Very Humid', description: 'High moisture saturation' };
}
