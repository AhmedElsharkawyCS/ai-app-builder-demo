import { useMemo, useState } from 'react';
import { Box, Typography, Paper, Skeleton, useTheme } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BarChartIcon from '@mui/icons-material/BarChart';
import RangeCalender from '@tap-payments/os-micro-frontend-shared/components/RangeCalender';

import { useCountries, useCities } from '../queries/countries.queries';
import { FilterBar } from './common/FilterBar';
import { BarChartCard } from './common/BarChartCard';
import type { BarSlice } from '../types/segments.types';

export function CountriesTab() {
  // Default to last 24 hours
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 24 * 60 * 60 * 1000),
    new Date()
  ]);

  const { data: countriesData, isLoading: countriesLoading, isError: countriesError } = useCountries(dateRange);
  const { data: citiesData, isLoading: citiesLoading, isError: citiesError } = useCities(dateRange);

  // Convert country data to bar chart format
  const countriesChartData = useMemo<BarSlice[] | undefined>(() => {
    if (!countriesData) return undefined;
    return countriesData.countries.map((country) => ({
      name: country.countryCode,
      value: country.sessions,
    }));
  }, [countriesData]);

  // Convert city data to bar chart format
  const citiesChartData = useMemo<BarSlice[] | undefined>(() => {
    if (!citiesData) return undefined;
    return citiesData.cities.map((city) => ({
      name: city.city,
      value: city.sessions,
    }));
  }, [citiesData]);

  const theme = useTheme();

  const renderSummaryCard = (
    label: string,
    value: number | undefined,
    icon: React.ReactNode,
    color: string,
    isLoading: boolean
  ) => (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '8px',
        p: 2,
        backgroundColor: '#ffffff',
        border: `1px solid ${theme.palette.divider}`,
        flex: 1,
        minWidth: 0,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: color,
          boxShadow: `0 2px 8px ${color}15`,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: color,
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: theme.palette.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            color: color,
            display: 'flex',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        {isLoading ? (
          <Skeleton variant="text" width={80} height={32} />
        ) : (
          <Typography
            sx={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: theme.palette.text.primary,
              lineHeight: 1,
              letterSpacing: '-0.5px',
            }}
          >
            {value?.toLocaleString() ?? '—'}
          </Typography>
        )}
      </Box>
    </Paper>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Filter Bar */}
      <FilterBar>
        <Box sx={{ flex: 1 }} />
        <RangeCalender
          defaultDate={dateRange}
          onDateChange={setDateRange}
          mode="gregorian"
          numberOfMonths={2}
          noTimezone
          noQuickFilter={false}
          timezone={null}
          defaultCountryTimezone="Asia/Dubai"
          browserTimezone={Intl.DateTimeFormat().resolvedOptions().timeZone}
          timezoneCountriesCodes={[]}
        />
      </FilterBar>

      {/* Scrollable Content Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 3,
          pb: 3,
        }}
      >
        {/* Summary Section */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2,
            }}
          >
            {renderSummaryCard(
              'Total Countries',
              countriesData?.totalCountries,
              <PublicIcon sx={{ fontSize: 24 }} />,
              '#3b82f6',
              countriesLoading
            )}
            {renderSummaryCard(
              'Total Cities',
              citiesData?.totalCities,
              <LocationCityIcon sx={{ fontSize: 24 }} />,
              '#7c3aed',
              citiesLoading
            )}
            {renderSummaryCard(
              'Total Sessions',
              countriesData?.totalSessions,
              <BarChartIcon sx={{ fontSize: 24 }} />,
              '#059669',
              countriesLoading
            )}
          </Box>
        </Box>

        {/* Bar Charts Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Countries Chart */}
          <BarChartCard
            title="Sessions by Country"
            data={countriesChartData}
            isLoading={countriesLoading}
            isError={countriesError}
          />

          {/* Cities Chart */}
          <BarChartCard
            title="Sessions by City"
            data={citiesChartData}
            isLoading={citiesLoading}
            isError={citiesError}
          />
        </Box>
      </Box>
    </Box>
  );
}
