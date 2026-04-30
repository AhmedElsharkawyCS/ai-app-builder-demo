export type DatePreset = '1h' | '3h' | '6h' | '12h' | '24h' | '1D' | '7d' | '7D' | '1M' | '3M';

export interface DatePresetOption {
  label: string;
  value: DatePreset;
  offsetMs: number;
}

export const DATE_PRESETS: DatePresetOption[] = [
  { label: '1h', value: '1h', offsetMs: 1 * 60 * 60 * 1000 },
  { label: '3h', value: '3h', offsetMs: 3 * 60 * 60 * 1000 },
  { label: '6h', value: '6h', offsetMs: 6 * 60 * 60 * 1000 },
  { label: '12h', value: '12h', offsetMs: 12 * 60 * 60 * 1000 },
  { label: '24h', value: '24h', offsetMs: 24 * 60 * 60 * 1000 },
  { label: '7D', value: '7D', offsetMs: 7 * 24 * 60 * 60 * 1000 },
  { label: '1M', value: '1M', offsetMs: 30 * 24 * 60 * 60 * 1000 },
  { label: '3M', value: '3M', offsetMs: 90 * 24 * 60 * 60 * 1000 },
];

// Returns an ISO string rounded to the nearest minute so the queryKey is stable
// within a minute window. Without rounding, Date.now() changes every millisecond
// and produces a new string — and therefore a new queryKey — on every render,
// causing React Query to treat every render as a cache miss and fire a new fetch.
export function isoFromOffset(offsetMs: number): string {
  const minuteMs = 60 * 1000;
  const rounded = Math.floor((Date.now() - offsetMs) / minuteMs) * minuteMs;
  return new Date(rounded).toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
}
