import { useQuery } from '@tanstack/react-query';

import { queryNewRelic } from '../api/newrelic';

const SINCE_DEFAULT = 'SINCE 24 hours ago';

function sinceClauseFrom(since?: string) {
  return since ? `SINCE '${since}'` : SINCE_DEFAULT;
}

// ── Application Types ──────────────────────────────────────────────────────

export interface ApplicationInfo {
  appCode: string;
  serviceCount: number;
}

export interface ServiceMetrics {
  serviceName: string;
  active: number;    // unique sessionIds
  sessions: number;  // unique (sessionId, segmentId) pairs
}

export interface AppServicesData {
  services: ServiceMetrics[];
}

// ── Query Hooks ────────────────────────────────────────────────────────────

/**
 * Fetch all unique application codes with their service counts
 */
export function useApplications(since?: string) {
  return useQuery<ApplicationInfo[]>({
    queryKey: ['newrelic', 'applications', since],
    queryFn: async () => {
      const sinceClause = sinceClauseFrom(since);
      const rows = await queryNewRelic<Record<string, unknown>>(
        `SELECT uniqueCount(serviceName) as service_count ` +
        `FROM PageAction ` +
        `WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' ` +
        `FACET appCode ` +
        `${sinceClause} ` +
        `LIMIT MAX`
      );

      return rows
        .filter((r) => r['appCode'] || r['facet'])
        .map((r) => {
          // FACET returns a single value as string or array with one element
          const facetValue = r['facet'];
          const appCode = r['appCode'] 
            ? String(r['appCode'])
            : Array.isArray(facetValue) 
            ? String(facetValue[0] ?? 'Unknown')
            : String(facetValue ?? 'Unknown');

          const serviceCount = typeof r['service_count'] === 'number' 
            ? r['service_count'] 
            : typeof r['uniqueCount.serviceName'] === 'number'
            ? r['uniqueCount.serviceName']
            : Number(r['service_count'] ?? r['uniqueCount.serviceName'] ?? 0);

          return { appCode, serviceCount };
        })
        .filter((app) => app.appCode !== 'Unknown');
    },
    retry: 1,
  });
}

/**
 * Fetch services for a specific application with Active and Sessions metrics
 */
export function useAppServices(appCode: string, since?: string) {
  return useQuery<AppServicesData>({
    queryKey: ['newrelic', 'app-services', appCode, since],
    queryFn: async () => {
      const sinceClause = sinceClauseFrom(since);
      const rows = await queryNewRelic<Record<string, unknown>>(
        `SELECT count(*) as total ` +
        `FROM PageAction ` +
        `WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' ` +
        `AND appCode = '${appCode}' ` +
        `FACET serviceName, sessionId, segmentId ` +
        `${sinceClause} ` +
        `LIMIT MAX`
      );

      // Group by serviceName to calculate metrics
      const serviceMap = new Map<string, {
        sessionIds: Set<string>,
        sessionSegmentPairs: Set<string>
      }>();

      rows.forEach((row) => {
        // New Relic FACET returns values in an array
        const facet = row['facet'] as unknown[];
        if (!facet || !Array.isArray(facet)) return;

        const serviceName = facet[0] ? String(facet[0]) : 'Unknown';
        const sessionId = facet[1] ? String(facet[1]) : null;
        const segmentId = facet[2] ? String(facet[2]) : null;

        if (serviceName === 'Unknown') return;

        // Initialize service entry even if sessionId is null
        if (!serviceMap.has(serviceName)) {
          serviceMap.set(serviceName, {
            sessionIds: new Set(),
            sessionSegmentPairs: new Set(),
          });
        }

        const metrics = serviceMap.get(serviceName)!;
        
        // Count all sessionIds including null for Active metric
        const sessionKey = sessionId ?? 'null';
        metrics.sessionIds.add(sessionKey);
        
        // Count pairs with segmentId for Sessions metric (including null sessionId)
        if (segmentId) {
          const pairKey = sessionId ? `${sessionId}:${segmentId}` : `null:${segmentId}`;
          metrics.sessionSegmentPairs.add(pairKey);
        }
      });

      // Convert map to array of ServiceMetrics
      const services: ServiceMetrics[] = Array.from(serviceMap.entries()).map(
        ([serviceName, metrics]) => ({
          serviceName,
          active: metrics.sessionIds.size,
          sessions: metrics.sessionSegmentPairs.size,
        })
      );

      return { services };
    },
    retry: 1,
    enabled: !!appCode,
  });
}
