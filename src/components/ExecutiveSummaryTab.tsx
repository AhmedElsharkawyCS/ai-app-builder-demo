import React, { useState, useMemo } from 'react';

import { Box, Typography, Paper, Skeleton, Tooltip, ToggleButton, ToggleButtonGroup, useTheme } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';

import {
  useActiveMerchants,
  useSessionAvgTime,
  useMostUsedBrowsers,
  useMostUsedDevices,
  useMostUsedCountries,
  useMostUsedSegments,
  useMostUsedApps,
  useMostUsedServices,
} from '../queries/analytics.queries';
import { FilterBar } from './common/FilterBar';
import { PieChartCard } from './common/PieChartCard';
import { BarChartCard } from './common/BarChartCard';
import { DATE_PRESETS, isoFromOffset, type DatePreset } from '../utils/datePresets';
import { formatHours } from '../utils/formatters';

interface KpiCardProps {
  label: string;
  value: number | undefined;
  isLoading: boolean;
  isError: boolean;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  onRefresh: () => void;
  description?: string;
  formatValue?: (v: number) => string;
}

function KpiCard({
  label,
  value,
  isLoading,
  isError,
  icon,
  iconBg,
  iconColor,
  onRefresh,
  description,
  formatValue,
}: KpiCardProps) {
  const theme = useTheme();
  const displayValue = value !== undefined
    ? (formatValue ? formatValue(value) : value.toLocaleString())
    : '—';

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '8px',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        backgroundColor: '#ffffff',
        border: `1px solid ${theme.palette.divider}`,
        minWidth: 0,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: iconColor,
          boxShadow: `0 2px 8px ${iconColor}15`,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: iconColor,
              flexShrink: 0,
            }}
          />
          <Box sx={{ color: iconColor, display: 'flex', flexShrink: 0 }}>
            {icon}
          </Box>
        </Box>

        <Tooltip title="Refresh">
          <Box
            component="button"
            onClick={onRefresh}
            sx={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              p: 0.5,
              borderRadius: '6px',
              color: '#9ca3af',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.15s, background 0.15s',
              '&:hover': { color: theme.palette.primary.main, backgroundColor: '#f0f7ff' },
            }}
          >
            <RefreshIcon sx={{ fontSize: 16 }} />
          </Box>
        </Tooltip>
      </Box>

      <Box>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: theme.palette.text.secondary, mb: 0.5 }}>
          {label}
        </Typography>

        {isLoading ? (
          <Skeleton variant="text" width={80} height={36} sx={{ borderRadius: '6px' }} />
        ) : isError ? (
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#dc2626' }}>
            —
          </Typography>
        ) : (
          <Typography
            sx={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: theme.palette.text.primary,
              lineHeight: 1.1,
              letterSpacing: '-0.5px',
            }}
          >
            {displayValue}
          </Typography>
        )}

        {description && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            <TrendingUpIcon sx={{ fontSize: 14, color: '#059669' }} />
            <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>
              {description}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        mb: 1.5,
      }}
    >
      {children}
    </Typography>
  );
}

export function ExecutiveSummaryTab() {
  const theme = useTheme();
  const [preset, setPreset] = useState<DatePreset>('24h');

  const sinceDate = useMemo(() => {
    const found = DATE_PRESETS.find((p) => p.value === preset);
    return found ? isoFromOffset(found.offsetMs) : undefined;
  }, [preset]);

  const {
    data: activeMerchants,
    isLoading: loadingMerchants,
    isError: errorMerchants,
    refetch: refetchMerchants,
  } = useActiveMerchants(sinceDate);

  const {
    data: sessionAvgTime,
    isLoading: loadingAvgTime,
    isError: errorAvgTime,
    refetch: refetchAvgTime,
  } = useSessionAvgTime(sinceDate);

  const {
    data: browsersData,
    isLoading: loadingBrowsers,
    isError: errorBrowsers,
  } = useMostUsedBrowsers(sinceDate);

  const {
    data: devicesData,
    isLoading: loadingDevices,
    isError: errorDevices,
  } = useMostUsedDevices(sinceDate);

  const {
    data: countriesData,
    isLoading: loadingCountries,
    isError: errorCountries,
  } = useMostUsedCountries(sinceDate);

  const {
    data: segmentsData,
    isLoading: loadingSegments,
    isError: errorSegments,
  } = useMostUsedSegments(sinceDate);

  const {
    data: appsData,
    isLoading: loadingApps,
    isError: errorApps,
  } = useMostUsedApps(sinceDate);

  const {
    data: servicesData,
    isLoading: loadingServices,
    isError: errorServices,
  } = useMostUsedServices(sinceDate);

  return (
    <Box>
      {/* ── Filter bar ── */}
      <FilterBar>
        <ToggleButtonGroup
          value={preset}
          exclusive
          onChange={(_, v) => { if (v) setPreset(v); }}
          size="small"
          sx={{ gap: '4px' }}
        >
          {DATE_PRESETS.map((p) => (
            <ToggleButton key={p.value} value={p.value}>
              {p.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </FilterBar>

      {/* ── Key Metrics ── */}
      <SectionLabel>Key Metrics</SectionLabel>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 2,
          mb: 3,
        }}
      >
        <KpiCard
          label="Active Merchants"
          value={activeMerchants}
          isLoading={loadingMerchants}
          isError={errorMerchants}
          icon={<StorefrontIcon sx={{ fontSize: 20 }} />}
          iconBg="#e8f4fd"
          iconColor={theme.palette.primary.main}
          onRefresh={() => refetchMerchants()}
          description="Unique brands with login activity"
        />

        <KpiCard
          label="Session Avg Time in Hours"
          value={sessionAvgTime}
          isLoading={loadingAvgTime}
          isError={errorAvgTime}
          icon={<TimerOutlinedIcon sx={{ fontSize: 20 }} />}
          iconBg="#f0fdf4"
          iconColor="#059669"
          onRefresh={() => refetchAvgTime()}
          description="Average duration per completed session"
          formatValue={formatHours}
        />
      </Box>

      {/* ── Usage Distribution ── */}
      <SectionLabel>Usage Distribution</SectionLabel>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
          },
          gap: 2,
          mb: 2,
        }}
      >
        <PieChartCard
          title="Most Used Browsers"
          data={browsersData}
          isLoading={loadingBrowsers}
          isError={errorBrowsers}
        />
        <PieChartCard
          title="Most Used Devices"
          data={devicesData}
          isLoading={loadingDevices}
          isError={errorDevices}
        />
      </Box>

      {/* ── Access Countries full-width bar chart ── */}
      <Box sx={{ mb: 3 }}>
        <BarChartCard
          title="Access Countries"
          data={countriesData}
          isLoading={loadingCountries}
          isError={errorCountries}
        />
      </Box>

      {/* ── Top Usage ── */}
      <SectionLabel>Top Usage</SectionLabel>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <BarChartCard
          title="Most Used Segments"
          data={segmentsData}
          isLoading={loadingSegments}
          isError={errorSegments}
        />
        <BarChartCard
          title="Most Used Apps"
          data={appsData}
          isLoading={loadingApps}
          isError={errorApps}
        />
        <BarChartCard
          title="Most Used Services"
          data={servicesData}
          isLoading={loadingServices}
          isError={errorServices}
        />
      </Box>
    </Box>
  );
}
