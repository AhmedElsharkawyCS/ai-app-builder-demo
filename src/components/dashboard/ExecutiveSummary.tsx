import React, { useState } from 'react';

import { Box } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';

import { MetricWidget } from '../common/MetricWidget';
import { MostVisitedCountriesChart } from './MostVisitedCountriesChart';
import { MostVisitedSegmentsChart } from './MostVisitedSegmentsChart';
import { MostVisitedAppsChart } from './MostVisitedAppsChart';
import { MostVisitedServicesChart } from './MostVisitedServicesChart';
import { MerchantVisitsDialog } from './MerchantVisitsDialog';
import { DevicesPieChart } from './DevicesPieChart';
import { BrowsersPieChart } from './BrowsersPieChart';
import { OsPieChart } from './OsPieChart';

import {
  useMerchantVisits,
  useTotalSessions,
  useAvgSessionDuration,
} from '../../queries/dashboard.queries';
import { formatNumber, formatDuration } from '../../utils/format';
import type { TimePeriod } from '../../types/dashboard.types';

interface ExecutiveSummaryProps {
  timePeriod: TimePeriod;
}

export function ExecutiveSummary({ timePeriod }: ExecutiveSummaryProps) {
  const visits = useMerchantVisits(timePeriod);
  const sessions = useTotalSessions(timePeriod);
  const avgDuration = useAvgSessionDuration(timePeriod);
  const [dialogOpen, setDialogOpen] = useState(false);

  const visitsVal = visits.data?.[0]?.uniqueCount;
  const sessionsVal = sessions.data?.[0]?.count;
  const avgDurVal = avgDuration.data?.[0]?.average;

  const widgets = [
    {
      icon: <BoltIcon />,
      title: 'Total Merchant Visits',
      value: formatNumber(visitsVal),
      subtitle: 'Unique merchants accessing dashboard',
      isLoading: visits.isLoading,
      isError: visits.isError,
      refetch: visits.refetch,
      accentColor: '#7c3aed',
      accentGradient: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 40%, #a78bfa 100%)',
      onClick: () => setDialogOpen(true),
    },
    {
      icon: <ElectricBoltIcon />,
      title: 'Total Sessions',
      value: formatNumber(sessionsVal),
      subtitle: 'Number of sessions',
      isLoading: sessions.isLoading,
      isError: sessions.isError,
      refetch: sessions.refetch,
      accentColor: '#f59e0b',
      accentGradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 40%, #fbbf24 100%)',
    },
    {
      icon: <OfflineBoltIcon />,
      title: 'Avg Session Duration',
      value: formatDuration(avgDurVal),
      subtitle: 'How long merchants stay',
      isLoading: avgDuration.isLoading,
      isError: avgDuration.isError,
      refetch: avgDuration.refetch,
      accentColor: '#06b6d4',
      accentGradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 40%, #22d3ee 100%)',
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 2.5,
        }}
      >
        {widgets.map((w, i) => (
          <MetricWidget
            key={w.title}
            icon={w.icon}
            title={w.title}
            value={w.value}
            subtitle={w.subtitle}
            isLoading={w.isLoading}
            isError={w.isError}
            refetch={w.refetch}
            index={i}
            accentColor={w.accentColor}
            accentGradient={w.accentGradient}
            onClick={w.onClick}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, 1fr)',
          },
          gap: 2.5,
        }}
      >
        <DevicesPieChart />
        <BrowsersPieChart />
        <OsPieChart />
      </Box>

      <MostVisitedCountriesChart />
      <MostVisitedSegmentsChart />
      <MostVisitedAppsChart />
      <MostVisitedServicesChart />

      <MerchantVisitsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        timePeriod={timePeriod}
      />
    </Box>
  );
}