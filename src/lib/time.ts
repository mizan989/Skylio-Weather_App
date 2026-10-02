/**
 * Timezone-aware formatting utilities for Skylio.
 * Ensures timestamps are rendered according to the forecast location's actual timezone.
 */

export function formatLocalTime(
  dateInput: Date | string = new Date(),
  timezone?: string,
  format24h: boolean = false
): string {
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const options: Intl.DateTimeFormatOptions = {
      hour: format24h ? '2-digit' : 'numeric',
      minute: '2-digit',
      hour12: !format24h,
      timeZone: timezone || undefined,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: !format24h });
  }
}

export function formatHourLabel(
  isoString: string,
  timezone?: string,
  format24h: boolean = false
): string {
  try {
    // Open-Meteo returns ISO strings without trailing Z when timezone=auto is passed,
    // which represents local time at the location.
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      hour: format24h ? '2-digit' : 'numeric',
      hour12: !format24h,
      timeZone: timezone || undefined,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    const d = new Date(isoString);
    return `${d.getHours()}:00`;
  }
}

export function formatDayLabel(
  isoString: string,
  timezone?: string,
  isToday: boolean = false
): { day: string; date: string; full: string } {
  if (isToday) {
    return { day: 'Today', date: 'Now', full: 'Today' };
  }
  try {
    const date = new Date(isoString);
    const optionsWeekday: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      timeZone: timezone || undefined,
    };
    const optionsDate: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      timeZone: timezone || undefined,
    };
    const weekday = new Intl.DateTimeFormat('en-US', optionsWeekday).format(date);
    const dayMonth = new Intl.DateTimeFormat('en-US', optionsDate).format(date);
    return { day: weekday, date: dayMonth, full: `${weekday}, ${dayMonth}` };
  } catch {
    const d = new Date(isoString);
    return {
      day: d.toLocaleDateString([], { weekday: 'short' }),
      date: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      full: d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
    };
  }
}

export function formatSunTime(
  isoString?: string,
  timezone?: string,
  format24h: boolean = false
): string {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      hour: format24h ? '2-digit' : 'numeric',
      minute: '2-digit',
      hour12: !format24h,
      timeZone: timezone || undefined,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    return '—';
  }
}

export function formatDaylightDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return '—';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

/**
 * Finds the index in hourly.time matching current location hour,
 * fallbacking to closest upcoming hour.
 */
export function getCurrentHourIndex(times: string[], timezone?: string): number {
  if (!times || times.length === 0) return 0;
  try {
    // Get current local time formatted in location's timezone: YYYY-MM-DDTHH:00
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone || undefined,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23',
    });
    const parts = formatter.formatToParts(now);
    const partMap: Record<string, string> = {};
    for (const p of parts) partMap[p.type] = p.value;

    const currentHourTarget = `${partMap.year}-${partMap.month}-${partMap.day}T${partMap.hour}`;

    const matchIdx = times.findIndex((t) => t.startsWith(currentHourTarget));
    if (matchIdx !== -1) return matchIdx;

    // Fallback: closest upcoming time
    const nowTs = now.getTime();
    const futureIdx = times.findIndex((t) => new Date(t).getTime() >= nowTs - 3600000);
    return futureIdx >= 0 ? futureIdx : 0;
  } catch {
    return 0;
  }
}
