import { useQuery } from '@tanstack/react-query';

import { queryNewRelic } from '../api/newrelic';
import type { PieSlice, BarSlice } from '../types/segments.types';

const SINCE_DEFAULT = 'SINCE 24 hours ago';

function sinceClauseFrom(since?: string) {
  return since ? `SINCE '${since}'` : SINCE_DEFAULT;
}

// ── Executive Summary Analytics ────────────────────────────────────────────

export function useActiveMerchants(since?: string) {
  return useQuery<number>({
    queryKey: ['newrelic', 'active-merchants', since],
    queryFn: async () => {
      const sinceClause = sinceClauseFrom(since);
      const rows = await queryNewRelic<Record<string, unknown>>(
        `SELECT uniqueCount(first_brand_name) AS active_merchants FROM TAPOS_SESSION WHERE action = 'login' ${sinceClause}`
      );
      if (!rows || rows.length === 0) return 0;
      const val =
        rows[0]['active_merchants'] ??
        rows[0]['uniqueCount.first_brand_name'] ??
        rows[0]['uniqueCount(first_brand_name)'];
      return typeof val === 'number' ? val : Number(val) || 0;
    },
    retry: 1,
  });
}

export function useSessionAvgTime(since?: string) {
  return useQuery<number>({
    queryKey: ['newrelic', 'session-avg-time', since],
    queryFn: async () => {
      const sinceClause = sinceClauseFrom(since);
      const rows = await queryNewRelic<Record<string, unknown>>(
        `SELECT average(session_duration) AS session_Avg_time_in_hours ` +
        `FROM (SELECT (latest(timestamp)-earliest(timestamp))/(1000*60*60) AS session_duration ` +
        `FROM TAPOS_SESSION WHERE action IN ('login', 'logout') FACET session_id) ` +
        `${sinceClause}`
      );
      if (!rows || rows.length === 0) return 0;
      const val =
        rows[0]['session_Avg_time_in_hours'] ??
        rows[0]['average.session_duration'] ??
        rows[0]['average(session_duration)'];
      return typeof val === 'number' ? val : Number(val) || 0;
    },
    retry: 1,
  });
}

export function useMostUsedBrowsers(since?: string) {
  return useQuery<PieSlice[]>({
    queryKey: ['newrelic', 'most-used-browsers', since],
    queryFn: async () => {
      const sinceClause = sinceClauseFrom(since);
      const rows = await queryNewRelic<Record<string, unknown>>(
        `SELECT count(*) as count FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET userAgentName ${sinceClause} LIMIT MAX`
      );
      return rows
        .filter((r) => r['userAgentName'] || r['facet'])
        .map((r) => ({
          name: String(r['userAgentName'] ?? r['facet'] ?? 'Unknown'),
          value: typeof r['count'] === 'number' ? r['count'] : Number(r['count'] ?? 0),
        }))
        .filter((s) => s.value > 0);
    },
    retry: 1,
  });
}

export function useMostUsedDevices(since?: string) {
  return useQuery<PieSlice[]>({
    queryKey: ['newrelic', 'most-used-devices', since],
    queryFn: async () => {
      const sinceClause = sinceClauseFrom(since);
      const rows = await queryNewRelic<Record<string, unknown>>(
        `SELECT count(*) as count FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET userAgentOS ${sinceClause} LIMIT MAX`
      );
      return rows
        .filter((r) => r['userAgentOS'] || r['facet'])
        .map((r) => ({
          name: String(r['userAgentOS'] ?? r['facet'] ?? 'Unknown'),
          value: typeof r['count'] === 'number' ? r['count'] : Number(r['count'] ?? 0),
        }))
        .filter((s) => s.value > 0);
    },
    retry: 1,
  });
}

export function useMostUsedCountries(since?: string) {
  return useQuery<PieSlice[]>({
    queryKey: ['newrelic', 'most-used-countries', since],
    queryFn: async () => {
      const sinceClause = sinceClauseFrom(since);
      const rows = await queryNewRelic<Record<string, unknown>>(
        `SELECT count(*) as count FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET countryCode ${sinceClause} LIMIT MAX`
      );
      return rows
        .filter((r) => r['countryCode'] || r['facet'])
        .map((r) => ({
          name: String(r['countryCode'] ?? r['facet'] ?? 'Unknown'),
          value: typeof r['count'] === 'number' ? r['count'] : Number(r['count'] ?? 0),
        }))
        .filter((s) => s.value > 0);
    },
    retry: 1,
  });
}

export function useMostUsedSegments(since?: string) {
  return useQuery<BarSlice[]>({
    queryKey: ['newrelic', 'most-used-segments', since],
    queryFn: async () => {
      const sinceClause = sinceClauseFrom(since);
      const rows = await queryNewRelic<Record<string, unknown>>(
        `SELECT count(*) FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET segmentCode ${sinceClause} LIMIT MAX`
      );
      return rows
        .filter((r) => r['segmentCode'] || r['facet'])
        .map((r) => ({
          name: String(r['segmentCode'] ?? r['facet'] ?? 'Unknown'),
          value: typeof r['count(*)'] === 'number' ? r['count(*)'] : Number(r['count(*)'] ?? r['count'] ?? 0),
        }))
        .filter((s) => s.value > 0)
        .sort((a, b) => b.value - a.value);
    },
    retry: 1,
  });
}

export function useMostUsedApps(since?: string) {
  return useQuery<BarSlice[]>({
    queryKey: ['newrelic', 'most-used-apps', since],
    queryFn: async () => {
      const sinceClause = sinceClauseFrom(since);
      const rows = await queryNewRelic<Record<string, unknown>>(
        `SELECT count(*) FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET appCode ${sinceClause} LIMIT MAX`
      );
      return rows
        .filter((r) => r['appCode'] || r['facet'])
        .map((r) => ({
          name: String(r['appCode'] ?? r['facet'] ?? 'Unknown'),
          value: typeof r['count(*)'] === 'number' ? r['count(*)'] : Number(r['count(*)'] ?? r['count'] ?? 0),
        }))
        .filter((s) => s.value > 0)
        .sort((a, b) => b.value - a.value);
    },
    retry: 1,
  });
}

export function useMostUsedServices(since?: string) {
  return useQuery<BarSlice[]>({
    queryKey: ['newrelic', 'most-used-services', since],
    queryFn: async () => {
      const sinceClause = sinceClauseFrom(since);
      const rows = await queryNewRelic<Record<string, unknown>>(
        `SELECT count(*) FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET serviceName ${sinceClause} LIMIT MAX`
      );
      return rows
        .filter((r) => r['serviceName'] || r['facet'])
        .map((r) => ({
          name: String(r['serviceName'] ?? r['facet'] ?? 'Unknown'),
          value: typeof r['count(*)'] === 'number' ? r['count(*)'] : Number(r['count(*)'] ?? r['count'] ?? 0),
        }))
        .filter((s) => s.value > 0)
        .sort((a, b) => b.value - a.value);
    },
    retry: 1,
  });
}
