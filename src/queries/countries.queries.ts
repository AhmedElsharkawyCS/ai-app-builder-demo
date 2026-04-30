import { useQuery } from '@tanstack/react-query';

import { queryNewRelic } from '../api/newrelic';

function formatDateForNRQL(date: Date): string {
  return date.toISOString();
}

function getDateRangeClause(dateRange?: [Date, Date]): string {
  if (!dateRange) {
    return 'SINCE 24 hours ago';
  }
  const [startDate, endDate] = dateRange;
  return `SINCE '${formatDateForNRQL(startDate)}' UNTIL '${formatDateForNRQL(endDate)}'`;
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface CountryStats {
  countryCode: string;
  sessions: number; // unique (sessionId, segmentId) pairs
}

export interface CityStats {
  city: string;
  sessions: number; // unique (sessionId, segmentId) pairs
}

export interface CountriesData {
  countries: CountryStats[];
  totalCountries: number;
  totalSessions: number;
}

export interface CitiesData {
  cities: CityStats[];
  totalCities: number;
  totalSessions: number;
}

// ── Query Hooks ────────────────────────────────────────────────────────────

/**
 * Fetch session statistics grouped by country
 */
export function useCountries(dateRange?: [Date, Date]) {
  return useQuery<CountriesData>({
    queryKey: ['newrelic', 'countries', dateRange],
    queryFn: async () => {
      const dateClause = getDateRangeClause(dateRange);
      const rows = await queryNewRelic<Record<string, unknown>>(
        `SELECT count(*) as total ` +
        `FROM PageAction ` +
        `WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' ` +
        `FACET countryCode, sessionId, segmentId ` +
        `${dateClause} ` +
        `LIMIT MAX`
      );

      // Group by countryCode to calculate metrics
      const countryMap = new Map<string, Set<string>>();

      rows.forEach((row) => {
        const facet = row['facet'] as unknown[];
        if (!facet || !Array.isArray(facet)) return;

        const countryCode = facet[0] ? String(facet[0]) : 'Unknown';
        const sessionId = facet[1] ? String(facet[1]) : null;
        const segmentId = facet[2] ? String(facet[2]) : null;

        if (countryCode === 'Unknown') return;

        // Initialize country entry
        if (!countryMap.has(countryCode)) {
          countryMap.set(countryCode, new Set());
        }

        const sessionSegmentPairs = countryMap.get(countryCode)!;
        
        // Count pairs with segmentId (including null sessionId)
        if (segmentId) {
          const pairKey = sessionId ? `${sessionId}:${segmentId}` : `null:${segmentId}`;
          sessionSegmentPairs.add(pairKey);
        }
      });

      // Convert map to array of CountryStats
      const countries: CountryStats[] = Array.from(countryMap.entries())
        .map(([countryCode, pairs]) => ({
          countryCode,
          sessions: pairs.size,
        }))
        .sort((a, b) => b.sessions - a.sessions); // Sort by sessions descending

      const totalSessions = countries.reduce((sum, country) => sum + country.sessions, 0);

      return {
        countries,
        totalCountries: countries.length,
        totalSessions,
      };
    },
    retry: 1,
  });
}

/**
 * Fetch session statistics grouped by city
 */
export function useCities(dateRange?: [Date, Date]) {
  return useQuery<CitiesData>({
    queryKey: ['newrelic', 'cities', dateRange],
    queryFn: async () => {
      const dateClause = getDateRangeClause(dateRange);
      const rows = await queryNewRelic<Record<string, unknown>>(
        `SELECT count(*) as total ` +
        `FROM PageAction ` +
        `WHERE actionName = 'TAPOS_APP_WINDOW_OPENED' ` +
        `FACET city, sessionId, segmentId ` +
        `${dateClause} ` +
        `LIMIT MAX`
      );

      // Group by city to calculate metrics
      const cityMap = new Map<string, Set<string>>();

      rows.forEach((row) => {
        const facet = row['facet'] as unknown[];
        if (!facet || !Array.isArray(facet)) return;

        const city = facet[0] ? String(facet[0]) : 'Unknown';
        const sessionId = facet[1] ? String(facet[1]) : null;
        const segmentId = facet[2] ? String(facet[2]) : null;

        if (city === 'Unknown') return;

        // Initialize city entry
        if (!cityMap.has(city)) {
          cityMap.set(city, new Set());
        }

        const sessionSegmentPairs = cityMap.get(city)!;
        
        // Count pairs with segmentId (including null sessionId)
        if (segmentId) {
          const pairKey = sessionId ? `${sessionId}:${segmentId}` : `null:${segmentId}`;
          sessionSegmentPairs.add(pairKey);
        }
      });

      // Convert map to array of CityStats
      const cities: CityStats[] = Array.from(cityMap.entries())
        .map(([city, pairs]) => ({
          city,
          sessions: pairs.size,
        }))
        .sort((a, b) => b.sessions - a.sessions); // Sort by sessions descending

      const totalSessions = cities.reduce((sum, city) => sum + city.sessions, 0);

      return {
        cities,
        totalCities: cities.length,
        totalSessions,
      };
    },
    retry: 1,
  });
}
