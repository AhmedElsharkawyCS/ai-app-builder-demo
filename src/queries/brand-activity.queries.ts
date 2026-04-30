import { useQuery } from '@tanstack/react-query';

import { queryNewRelic } from '../api/newrelic';
import type { SegmentActivity, SessionBrandDrillDown } from '../types/segments.types';

const SINCE_DEFAULT = 'SINCE 24 hours ago';

function sinceClauseFrom(since?: string) {
  return since ? `SINCE '${since}'` : SINCE_DEFAULT;
}

// ── Brand & Session Activity ───────────────────────────────────────────────

export function useUniqueBrands() {
  return useQuery<string[]>({
    queryKey: ['newrelic', 'unique-brands'],
    queryFn: async () => {
      const rows = await queryNewRelic<Record<string, unknown>>(
        `FROM TAPOS_SESSION SELECT uniques(first_brand_name) SINCE 1 quarter ago LIMIT max`
      );
      if (!rows || rows.length === 0) return [];
      const first = rows[0];
      const val =
        first['uniques.first_brand_name'] ??
        first['uniques(first_brand_name)'];
      if (Array.isArray(val)) return (val as string[]).filter(Boolean).sort();
      return [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useSegmentActivityCount(since?: string, brand?: string) {
  return useQuery<number>({
    queryKey: ['newrelic', 'segment-activity-count', since, brand],
    queryFn: async () => {
      const sinceClause = sinceClauseFrom(since);
      const brandCondition = brand ? ` AND first_brand_name IN ('${brand}')` : '';
      const rows = await queryNewRelic<Record<string, unknown>>(
        `SELECT uniqueCount(first_brand_name) AS total FROM TAPOS_SESSION WHERE action='login'${brandCondition} ${sinceClause}`
      );
      if (!rows || rows.length === 0) return 0;
      const val = rows[0]['total'] ?? rows[0]['uniqueCount.first_brand_name'] ?? rows[0]['uniqueCount(first_brand_name)'];
      return typeof val === 'number' ? val : Number(val) || 0;
    },
    refetchInterval: 30000,
    retry: 1,
  });
}

export function useSegmentActivity(since?: string, brand?: string, page = 1, perPage = 9) {
  return useQuery<SegmentActivity[]>({
    queryKey: ['newrelic', 'segment-activity', since, brand, page, perPage],
    queryFn: async () => {
      const sinceClause = sinceClauseFrom(since);
      const brandCondition = brand ? ` AND first_brand_name IN ('${brand}')` : '';
      const rows = await queryNewRelic<SegmentActivity>(
        `SELECT uniqueCount(session_id) AS session_count, latest(segment_code) AS segment FROM TAPOS_SESSION WHERE action='login'${brandCondition} FACET first_brand_name ${sinceClause} LIMIT 1000`
      );
      const start = (page - 1) * perPage;
      return rows.slice(start, start + perPage);
    },
    refetchInterval: 30000,
    retry: 1,
  });
}

export function useSessionBrandDrillDown(brand?: string, since?: string) {
  return useQuery<SessionBrandDrillDown[]>({
    queryKey: ['newrelic', 'session-brand-drilldown', brand, since],
    queryFn: async () => {
      const sinceClause = sinceClauseFrom(since);
      const whereClause = brand ? `WHERE first_brand_name = '${brand}' ` : '';
      return queryNewRelic<SessionBrandDrillDown>(
        `FROM TAPOS_SESSION ` +
        `SELECT ` +
        `latest(user_name) AS user_name, ` +
        `latest(contact_email) AS contact_email, ` +
        `latest(action) AS action, ` +
        `latest(individual_id) AS individual_id, ` +
        `latest(segment_id) AS segment_id, ` +
        `latest(timestamp) AS action_at, ` +
        `filter(min(timestamp), WHERE action = 'login') AS login_time, ` +
        `filter(max(timestamp), WHERE action = 'logout') AS logout_time, ` +
        `(max(timestamp) - filter(min(timestamp), WHERE action = 'login')) / 1000 / 60 AS session_duration_minutes ` +
        `${whereClause}` +
        `FACET session_id ` +
        `${sinceClause} ` +
        `LIMIT 100`
      );
    },
    enabled: !!brand,
    retry: 1,
  });
}

export interface UniqueApp {
  appCode: string;
}

export function useUniqueAppsOpened(sessionId?: string) {
  return useQuery<UniqueApp[]>({
    queryKey: ['newrelic', 'unique-apps-opened', sessionId],
    queryFn: async () => {
      const rows = await queryNewRelic<Record<string, unknown>>(
        `SELECT uniques(appCode) AS apps FROM PageAction WHERE sessionId = '${sessionId}' AND actionName = 'TAPOS_APP_WINDOW_OPENED' SINCE '2026-04-01T09:13:51' LIMIT MAX`
      );
      if (!rows || rows.length === 0) return [];
      const first = rows[0];
      const val = first['apps'] ?? first['uniques.appCode'] ?? first['uniques(appCode)'];
      if (Array.isArray(val)) {
        return (val as string[])
          .filter(Boolean)
          .map((appCode) => ({ appCode }))
          .sort((a, b) => a.appCode.localeCompare(b.appCode));
      }
      return [];
    },
    enabled: !!sessionId,
    retry: 1,
  });
}
