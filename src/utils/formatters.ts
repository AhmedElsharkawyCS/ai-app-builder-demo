/**
 * Formats a timestamp (string or number) into a localized string
 * @param ts - Timestamp as string or number
 * @returns Formatted date string or '—' if invalid
 */
export function formatTimestamp(ts?: string | number): string {
  if (ts == null || ts === '') return '—';
  const d = new Date(typeof ts === 'number' ? ts : ts);
  return isNaN(d.getTime()) ? String(ts) : d.toLocaleString();
}

/**
 * Formats duration in minutes into a readable string (e.g., "1h 23m 45s")
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
export function formatDurationMinutes(minutes: number): string {
  if (isNaN(minutes) || minutes < 0) return '—';
  const totalSec = Math.round(minutes * 60);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export interface DurationResult {
  display: string;
  isLive: boolean;
}

/**
 * Resolves session duration from login/logout times, with support for live sessions
 * @param loginTime - Login timestamp (string or number)
 * @param logoutTime - Logout timestamp (string or number), undefined if session is live
 * @param precomputedMinutes - Pre-computed duration in minutes (fallback)
 * @returns Object with display string and isLive flag
 */
export function resolveDuration(
  loginTime?: string | number,
  logoutTime?: string | number,
  precomputedMinutes?: number
): DurationResult {
  const hasLogout =
    logoutTime != null &&
    logoutTime !== '' &&
    logoutTime !== 0 &&
    Number(logoutTime) > 0;

  if (hasLogout) {
    const loginMs = loginTime != null ? Number(loginTime) : NaN;
    const logoutMs = Number(logoutTime);
    if (!isNaN(loginMs) && loginMs > 0 && !isNaN(logoutMs)) {
      const minutes = (logoutMs - loginMs) / 1000 / 60;
      return { display: formatDurationMinutes(minutes), isLive: false };
    }
    if (precomputedMinutes != null && !isNaN(precomputedMinutes) && precomputedMinutes >= 0) {
      return { display: formatDurationMinutes(precomputedMinutes), isLive: false };
    }
    return { display: '—', isLive: false };
  }

  const loginMs = loginTime != null ? Number(loginTime) : NaN;
  if (!isNaN(loginMs) && loginMs > 0) {
    const minutes = (Date.now() - loginMs) / 1000 / 60;
    return { display: formatDurationMinutes(minutes), isLive: true };
  }

  return { display: '—', isLive: false };
}

/**
 * Formats hours into a readable string with automatic unit selection
 * @param hours - Duration in hours
 * @returns Formatted duration (e.g., "45s", "23m", "2h 15m")
 */
export function formatHours(hours: number): string {
  if (hours < 0.0167) {
    return `${Math.round(hours * 3600)}s`;
  }
  if (hours < 1) {
    const mins = Math.round(hours * 60);
    return `${mins}m`;
  }
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Truncates a string to a maximum length and adds ellipsis
 * @param str - String to truncate
 * @param max - Maximum length (default: 18)
 * @returns Truncated string with ellipsis if needed
 */
export function truncate(str: string, max = 18): string {
  return str.length > max ? `${str.slice(0, max)}…` : str;
}
