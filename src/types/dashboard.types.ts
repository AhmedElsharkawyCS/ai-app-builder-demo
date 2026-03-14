export type TabId = 'tab1' | 'tab2' | 'tab3';

export interface TabConfig {
  id: TabId;
  label: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  options: FilterOption[];
  dependsOn?: string;
}

export type TimePeriod = '1H' | '4H' | '1D' | '1W' | '1M';

export type ThemeMode = 'light' | 'dark';

export interface MerchantVisitsResult {
  uniqueCount: number;
}

export interface TotalSessionsResult {
  count: number;
}

export interface AvgSessionDurationResult {
  average: number;
}

export interface ActiveMerchantsResult {
  uniqueCount: number;
}

export interface TotalAppsResult {
  uniqueCount: number;
}

export interface TotalServicesResult {
  uniqueCount: number;
}

export interface TotalAppsOpenedResult {
  count: number;
}

export interface TopMerchantResult {
  facet: string;
  Brand: string;
  count: number;
}

export interface ActivityTrendResult {
  beginTimeSeconds: number;
  endTimeSeconds: number;
  facet: string;
  appCode: string;
  count: number;
}

export interface EngagementDepthResult {
  facet: string;
  Brand: string;
  sessions: number;
  apps: number;
  services: number;
}

export interface MostVisitedAppsResult {
  facet: string;
  appCode: string;
  count: number;
}

export interface MostVisitedServicesResult {
  facet: string;
  serviceName: string;
  count: number;
}

export interface MostVisitedCountriesResult {
  facet: string;
  countryCode: string;
  count: number;
}

export interface MostVisitedSegmentsResult {
  facet: string | string[];
  segmentCode: string;
  segmentName: string;
  count: number;
}

export interface MerchantBrandDetailResult {
  facet: string | string[];
  Brand: string;
  countryCode: string;
  count: number;
  sessions: number;
  apps: number;
  services: number;
}

export interface BrandByCountryResult {
  facet: string;
  Brand: string;
  count: number;
}

export interface DeviceTypeResult {
  facet: string;
  deviceType: string;
  count: number;
}

export interface BrowserResult {
  facet: string;
  userAgentName: string;
  count: number;
}

export interface OperatingSystemResult {
  facet: string;
  userAgentOS: string;
  count: number;
}

export interface DailyActiveMerchantsTrendResult {
  beginTimeSeconds: number;
  uniqueCount: number;
}

export interface StickinessDauMauResult {
  uniqueCount: number;
}

export interface MerchantEngagementTrendResult {
  beginTimeSeconds: number;
  count: number;
}

export interface TopReturningMerchantResult {
  facet: string;
  Brand: string;
  count: number;
}

export interface AppsPerMerchantResult {
  facet: string;
  Brand: string;
  uniqueCount: number;
}

export interface ServicesPerMerchantResult {
  facet: string;
  Brand: string;
  uniqueCount: number;
}

export interface AllBrandsResult {
  facet: string;
  Brand: string;
  count: number;
}