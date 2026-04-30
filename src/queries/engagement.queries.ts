import { useQuery } from '@tanstack/react-query';

import { queryNewRelic } from '../api/newrelic';

const SINCE_DEFAULT = 'SINCE 24 hours ago';

function sinceClauseFrom(since?: string) {
  return since ? `SINCE '${since}'` : SINCE_DEFAULT;
}

// ── Cohort Retention & Engagement ──────────────────────────────────────────

export interface EngagementDepthRow {
  brand: string;
  time: string;
  appCount: number;
}

export type EngagementDepthPoint = Record<string, string | number>;

export interface EngagementDepthResult {
  rows: EngagementDepthRow[];
  brands: string[];
  points: EngagementDepthPoint[];
}

const TIMESERIES_BY_PRESET: Record<string, string> = {
  '1h':  'TIMESERIES 1 minute',
  '3h':  'TIMESERIES 5 minutes',
  '6h':  'TIMESERIES 10 minutes',
  '12h': 'TIMESERIES 30 minutes',
  '1D':  'TIMESERIES 1 day',
  '7D':  'TIMESERIES 1 day',
  '1M':  'TIMESERIES 1 week',
  '3M':  'TIMESERIES 1 week',
};

export function useMerchantEngagementDepth(since?: string, preset?: string, brand?: string) {
  return useQuery<EngagementDepthResult>({
    queryKey: ['newrelic', 'merchant-engagement-depth', since, preset, brand],
    queryFn: async () => {
      const sinceClause = sinceClauseFrom(since);
      const timeseriesClause = (preset && TIMESERIES_BY_PRESET[preset]) ?? 'TIMESERIES 1 day';
      const brandCondition = brand ? ` AND Brand = '${brand}'` : '';

      const raw = await queryNewRelic<Record<string, unknown>>(
        `SELECT uniqueCount(appCode) AS unique_apps_opened FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' AND Brand IS NOT NULL AND Brand != ''${brandCondition} ${sinceClause} FACET Brand ${timeseriesClause} LIMIT MAX`
      );

      const rows: EngagementDepthRow[] = raw
        .map((r) => {
          const facetArr = Array.isArray(r['facet']) ? (r['facet'] as unknown[]) : null;

          const brand = String(
            r['Brand'] ??
            r['brand'] ??
            (facetArr ? facetArr[0] : null) ??
            'Unknown'
          );

          let time = '';
          if (typeof r['beginTimeSeconds'] === 'number') {
            time = new Date(r['beginTimeSeconds'] * 1000).toISOString().slice(0, 16);
          } else if (typeof r['endTimeSeconds'] === 'number') {
            time = new Date(r['endTimeSeconds'] * 1000).toISOString().slice(0, 16);
          } else {
            const rawDate =
              r['dateOf(timestamp)'] ??
              r['dateOf.timestamp'] ??
              (facetArr ? facetArr[1] : null) ??
              (facetArr ? facetArr[0] : null);
            time = rawDate ? String(rawDate) : '';
          }

          const appCount =
            typeof r['unique_apps_opened'] === 'number'
              ? r['unique_apps_opened']
              : Number(r['unique_apps_opened'] ?? 0);

          return { brand, time, appCount };
        })
        .filter((r) => r.brand !== 'Unknown' || r.appCount > 0);

      const brandSet = new Set<string>();
      for (const r of rows) brandSet.add(r.brand);
      const brands = Array.from(brandSet).sort();

      const pivot = new Map<string, Record<string, number>>();
      for (const r of rows) {
        if (!r.time) continue;
        if (!pivot.has(r.time)) pivot.set(r.time, {});
        const bucket = pivot.get(r.time)!;
        bucket[r.brand] = (bucket[r.brand] ?? 0) + r.appCount;
      }

      const points: EngagementDepthPoint[] = Array.from(pivot.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([time, values]) => ({ time, ...values }));

      return { rows, brands, points };
    },
    retry: 1,
  });
}
