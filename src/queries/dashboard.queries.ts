import { useQuery } from '@tanstack/react-query';

import { queryNewRelic } from '../api/newrelic';
import type {
  TimePeriod,
  MerchantVisitsResult,
  TotalSessionsResult,
  ActiveMerchantsResult,
  AvgSessionDurationResult,
  TotalAppsOpenedResult,
  TotalServicesResult,
  TopMerchantResult,
  ActivityTrendResult,
  EngagementDepthResult,
  MostVisitedAppsResult,
  MostVisitedServicesResult,
  MostVisitedCountriesResult,
  MostVisitedSegmentsResult,
  MerchantBrandDetailResult,
  BrandByCountryResult,
  DeviceTypeResult,
  BrowserResult,
  OperatingSystemResult,
  DailyActiveMerchantsTrendResult,
  StickinessDauMauResult,
  MerchantEngagementTrendResult,
  TopReturningMerchantResult,
  AppsPerMerchantResult,
  ServicesPerMerchantResult,
  AllBrandsResult,
} from '../types/dashboard.types';

function timePeriodToSince(period: TimePeriod): string {
  const map: Record<TimePeriod, string> = {
    '1H': '1 hour ago',
    '4H': '4 hours ago',
    '1D': '1 day ago',
    '1W': '1 week ago',
    '1M': '1 month ago',
  };
  return map[period];
}

function getTimeseries(period: TimePeriod): string {
  return period === '1H' ? 'TIMESERIES 5 minutes' :
    period === '4H' ? 'TIMESERIES 15 minutes' :
    period === '1D' ? 'TIMESERIES 1 hour' :
    period === '1W' ? 'TIMESERIES 1 day' :
    'TIMESERIES 1 day';
}

export function useMerchantVisits(period: TimePeriod) {
  const since = timePeriodToSince(period);
  return useQuery<MerchantVisitsResult[]>({
    queryKey: ['newrelic', 'merchantVisits', period],
    queryFn: () =>
      queryNewRelic<MerchantVisitsResult>(
        `SELECT uniqueCount(Brand) as uniqueCount FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' SINCE ${since}`
      ),
  });
}

export function useTotalSessions(period: TimePeriod) {
  const since = timePeriodToSince(period);
  return useQuery<TotalSessionsResult[]>({
    queryKey: ['newrelic', 'totalSessions', period],
    queryFn: () =>
      queryNewRelic<TotalSessionsResult>(
        `SELECT count(*) as count FROM PageAction WHERE actionName = 'loggingActivity' SINCE ${since}`
      ),
  });
}

export function useActiveMerchants7d() {
  return useQuery<ActiveMerchantsResult[]>({
    queryKey: ['newrelic', 'activeMerchants7d'],
    queryFn: () =>
      queryNewRelic<ActiveMerchantsResult>(
        `SELECT uniqueCount(Brand) as uniqueCount FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' SINCE 7 days ago`
      ),
  });
}

export function useActiveMerchants30d() {
  return useQuery<ActiveMerchantsResult[]>({
    queryKey: ['newrelic', 'activeMerchants30d'],
    queryFn: () =>
      queryNewRelic<ActiveMerchantsResult>(
        `SELECT uniqueCount(Brand) as uniqueCount FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' SINCE 30 days ago`
      ),
  });
}

export function useAvgSessionDuration(period: TimePeriod) {
  const since = timePeriodToSince(period);
  return useQuery<AvgSessionDurationResult[]>({
    queryKey: ['newrelic', 'avgSessionDuration', period],
    queryFn: () =>
      queryNewRelic<AvgSessionDurationResult>(
        `SELECT average(timeSinceLoad) as average FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' SINCE ${since}`
      ),
  });
}

export function useTotalAppsOpened(period: TimePeriod) {
  const since = timePeriodToSince(period);
  return useQuery<TotalAppsOpenedResult[]>({
    queryKey: ['newrelic', 'totalAppsOpened', period],
    queryFn: () =>
      queryNewRelic<TotalAppsOpenedResult>(
        `SELECT count(*) as count FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' SINCE ${since}`
      ),
  });
}

export function useTotalServicesAccessed(period: TimePeriod) {
  const since = timePeriodToSince(period);
  return useQuery<TotalServicesResult[]>({
    queryKey: ['newrelic', 'totalServices', period],
    queryFn: () =>
      queryNewRelic<TotalServicesResult>(
        `SELECT uniqueCount(serviceName) as uniqueCount FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' SINCE ${since}`
      ),
  });
}

export function useTopActiveMerchants(period: TimePeriod) {
  const since = timePeriodToSince(period);
  return useQuery<TopMerchantResult[]>({
    queryKey: ['newrelic', 'topActiveMerchants', period],
    queryFn: () =>
      queryNewRelic<TopMerchantResult>(
        `SELECT count(*) as count FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET Brand SINCE ${since} LIMIT 20`
      ),
  });
}

export function useAllBrands(period: TimePeriod) {
  const since = timePeriodToSince(period);
  return useQuery<AllBrandsResult[]>({
    queryKey: ['newrelic', 'allBrands', period],
    queryFn: () =>
      queryNewRelic<AllBrandsResult>(
        `SELECT count(*) as count FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET Brand SINCE ${since} LIMIT 200`
      ),
  });
}

export function useActivityTrend(period: TimePeriod, brand?: string | null) {
  const brandFilter = brand ? `AND Brand = '${brand}'` : '';
  return useQuery<ActivityTrendResult[]>({
    queryKey: ['newrelic', 'activityTrend', period, brand ?? '__all__'],
    queryFn: () =>
      queryNewRelic<ActivityTrendResult>(
        `SELECT count(*) as count FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' ${brandFilter} FACET appCode SINCE 1 day ago TIMESERIES 1 hour`
      ),
  });
}

export function useEngagementDepth(period: TimePeriod) {
  const since = timePeriodToSince(period);
  return useQuery<EngagementDepthResult[]>({
    queryKey: ['newrelic', 'engagementDepth', period],
    queryFn: () =>
      queryNewRelic<EngagementDepthResult>(
        `SELECT uniqueCount(session) as sessions, uniqueCount(appCode) as apps, uniqueCount(serviceName) as services FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET Brand SINCE ${since} LIMIT 50`
      ),
  });
}

export function useMostVisitedApps() {
  return useQuery<MostVisitedAppsResult[]>({
    queryKey: ['newrelic', 'mostVisitedApps'],
    queryFn: () =>
      queryNewRelic<MostVisitedAppsResult>(
        `SELECT count(*) as count FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET appCode SINCE 7 days ago LIMIT 10`
      ),
  });
}

export function useMostVisitedServices() {
  return useQuery<MostVisitedServicesResult[]>({
    queryKey: ['newrelic', 'mostVisitedServices'],
    queryFn: () =>
      queryNewRelic<MostVisitedServicesResult>(
        `SELECT count(*) FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET serviceName SINCE 7 days ago LIMIT 10`
      ),
  });
}

export function useMostVisitedCountries() {
  return useQuery<MostVisitedCountriesResult[]>({
    queryKey: ['newrelic', 'mostVisitedCountries'],
    queryFn: () =>
      queryNewRelic<MostVisitedCountriesResult>(
        `SELECT count(*) as count FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET countryCode SINCE 7 days ago LIMIT 10`
      ),
  });
}

export function useMostVisitedSegments() {
  return useQuery<MostVisitedSegmentsResult[]>({
    queryKey: ['newrelic', 'mostVisitedSegments'],
    queryFn: () =>
      queryNewRelic<MostVisitedSegmentsResult>(
        `SELECT count(*) as count FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET segmentCode, segmentName SINCE 7 days ago LIMIT 10`
      ),
  });
}

export function useMerchantBrandDetails(period: TimePeriod, enabled: boolean) {
  const since = timePeriodToSince(period);
  return useQuery<MerchantBrandDetailResult[]>({
    queryKey: ['newrelic', 'merchantBrandDetails', period],
    queryFn: () =>
      queryNewRelic<MerchantBrandDetailResult>(
        `SELECT count(*) as count, uniqueCount(session) as sessions, uniqueCount(appCode) as apps, uniqueCount(serviceName) as services FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET Brand, countryCode SINCE ${since} LIMIT 100`
      ),
    enabled,
  });
}

export function useBrandsByCountry(countryCode: string) {
  return useQuery<BrandByCountryResult[]>({
    queryKey: ['newrelic', 'brandsByCountry', countryCode],
    queryFn: () =>
      queryNewRelic<BrandByCountryResult>(
        `SELECT count(*) as count FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' AND countryCode = '${countryCode}' FACET Brand SINCE 30 days ago LIMIT 100`
      ),
    enabled: !!countryCode,
  });
}

export function useMostUsedDevices() {
  return useQuery<DeviceTypeResult[]>({
    queryKey: ['newrelic', 'mostUsedDevices'],
    queryFn: () =>
      queryNewRelic<DeviceTypeResult>(
        `SELECT count(*) as count FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET deviceType SINCE 7 days ago LIMIT 10`
      ),
  });
}

export function useMostUsedBrowsers() {
  return useQuery<BrowserResult[]>({
    queryKey: ['newrelic', 'mostUsedBrowsers'],
    queryFn: () =>
      queryNewRelic<BrowserResult>(
        `SELECT count(*) as count FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET userAgentName SINCE 7 days ago LIMIT 10`
      ),
  });
}

export function useMostUsedOperatingSystems() {
  return useQuery<OperatingSystemResult[]>({
    queryKey: ['newrelic', 'mostUsedOS'],
    queryFn: () =>
      queryNewRelic<OperatingSystemResult>(
        `SELECT count(*) as count FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET userAgentOS SINCE 7 days ago LIMIT 10`
      ),
  });
}

// --- Cohort Retention Queries ---

export function useDailyActiveMerchantsTrend(period: TimePeriod) {
  const since = timePeriodToSince(period);
  const timeseries = getTimeseries(period);
  return useQuery<DailyActiveMerchantsTrendResult[]>({
    queryKey: ['newrelic', 'dauTrend', period],
    queryFn: () =>
      queryNewRelic<DailyActiveMerchantsTrendResult>(
        `SELECT uniqueCount(Brand) as uniqueCount FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' SINCE ${since} ${timeseries}`
      ),
  });
}

export function useStickinessDau(period: TimePeriod) {
  const since = timePeriodToSince(period);
  return useQuery<StickinessDauMauResult[]>({
    queryKey: ['newrelic', 'stickinessDau', period],
    queryFn: () =>
      queryNewRelic<StickinessDauMauResult>(
        `SELECT uniqueCount(Brand) as uniqueCount FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' SINCE ${since}`
      ),
  });
}

export function useStickinessMau() {
  return useQuery<StickinessDauMauResult[]>({
    queryKey: ['newrelic', 'stickinessMau'],
    queryFn: () =>
      queryNewRelic<StickinessDauMauResult>(
        `SELECT uniqueCount(Brand) as uniqueCount FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' SINCE 30 days ago`
      ),
  });
}

export function useMerchantEngagementTrend(period: TimePeriod) {
  const since = timePeriodToSince(period);
  const timeseries = getTimeseries(period);
  return useQuery<MerchantEngagementTrendResult[]>({
    queryKey: ['newrelic', 'merchantEngagementTrend', period],
    queryFn: () =>
      queryNewRelic<MerchantEngagementTrendResult>(
        `SELECT count(*) as count FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' SINCE ${since} ${timeseries}`
      ),
  });
}

export function useTopReturningMerchants(period: TimePeriod) {
  const since = timePeriodToSince(period);
  return useQuery<TopReturningMerchantResult[]>({
    queryKey: ['newrelic', 'topReturningMerchants', period],
    queryFn: () =>
      queryNewRelic<TopReturningMerchantResult>(
        `SELECT count(*) as count FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET Brand SINCE ${since} LIMIT 10`
      ),
  });
}

export function useAppsPerMerchant(period: TimePeriod) {
  const since = timePeriodToSince(period);
  return useQuery<AppsPerMerchantResult[]>({
    queryKey: ['newrelic', 'appsPerMerchant', period],
    queryFn: () =>
      queryNewRelic<AppsPerMerchantResult>(
        `SELECT uniqueCount(appCode) as uniqueCount FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET Brand SINCE ${since} LIMIT 15`
      ),
  });
}

export function useServicesPerMerchant(period: TimePeriod) {
  const since = timePeriodToSince(period);
  return useQuery<ServicesPerMerchantResult[]>({
    queryKey: ['newrelic', 'servicesPerMerchant', period],
    queryFn: () =>
      queryNewRelic<ServicesPerMerchantResult>(
        `SELECT uniqueCount(serviceName) as uniqueCount FROM PageAction WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' FACET Brand SINCE ${since} LIMIT 15`
      ),
  });
}