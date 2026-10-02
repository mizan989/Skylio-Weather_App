import type { CurrentData, DailyData } from '../types/weather';

export interface WeatherInsight {
  headline: string;
  detail: string;
}

/**
 * Deterministic weather summaries derived strictly from validated Open-Meteo values.
 * Strictly adheres to Section 7.4 of the redesign brief:
 * - Transparent thresholds
 * - No medical, safety, or absolute claims
 * - Suppresses speculative causes
 */
export function getDeterministicWeatherSummary(
  current: CurrentData,
  daily: DailyData
): WeatherInsight {
  const precipMax = daily.precipitation_probability_max?.[0] ?? 0;
  const precipSum = daily.precipitation_sum?.[0] ?? 0;
  const windGusts = current.wind_gusts_10m ?? daily.wind_gusts_10m_max?.[0] ?? current.wind_speed_10m;
  const uvMax = daily.uv_index_max?.[0] ?? current.uv_index ?? 0;
  const tempDiff = current.apparent_temperature - current.temperature_2m;

  // 1. Significant precipitation
  if (precipMax >= 70) {
    return {
      headline: 'Rain Expected',
      detail: precipSum > 0
        ? `High likelihood of precipitation today with up to ${precipSum.toFixed(1)} mm forecast.`
        : `High probability of rainfall (${precipMax}%) during the day.`,
    };
  }

  if (precipMax >= 40) {
    return {
      headline: 'Showers Possible',
      detail: `Scattered precipitation possible today with a ${precipMax}% maximum chance.`,
    };
  }

  // 2. Strong winds or gusts
  if (windGusts >= 45) {
    return {
      headline: 'Brisk Wind Gusts',
      detail: `Peak wind gusts reaching ${Math.round(windGusts)} km/h across the area.`,
    };
  }

  // 3. Sub-freezing temperatures
  if (current.temperature_2m <= 0) {
    return {
      headline: 'Sub-Freezing Air',
      detail: 'Freezing temperatures observed; potential for ice on exposed surfaces.',
    };
  }

  // 4. Notable humidity / apparent temp disparity
  if (tempDiff >= 3 && current.relative_humidity_2m >= 65) {
    return {
      headline: 'Elevated Humidity',
      detail: `Relative humidity at ${current.relative_humidity_2m}%, making it feel warmer than the air temperature.`,
    };
  }

  if (tempDiff <= -3) {
    return {
      headline: 'Wind Chill Factor',
      detail: `Airflow causes conditions to feel cooler (${Math.round(current.apparent_temperature)}°) than measured air temperature.`,
    };
  }

  // 5. High solar UV radiation
  if (uvMax >= 8) {
    return {
      headline: 'High Solar UV',
      detail: `Maximum UV index of ${uvMax} forecast; UV levels elevate substantially around solar noon.`,
    };
  }

  // 6. Very dry conditions
  if (current.relative_humidity_2m < 25) {
    return {
      headline: 'Dry Air Mass',
      detail: `Atmospheric moisture is low with relative humidity at ${current.relative_humidity_2m}%.`,
    };
  }

  // 7. Settled / Clear conditions
  if (current.cloud_cover !== undefined && current.cloud_cover <= 15) {
    return {
      headline: 'Clear Skies',
      detail: 'Minimal cloud obstruction with clear atmospheric visibility.',
    };
  }

  // Default neutral observation
  return {
    headline: 'Stable Atmosphere',
    detail: 'Consistent conditions expected throughout the current forecast cycle.',
  };
}
