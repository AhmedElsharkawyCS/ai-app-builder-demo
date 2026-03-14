import React from 'react';

import DevicesIcon from '@mui/icons-material/Devices';

import { PieChartWidget } from './PieChartWidget';
import { useMostUsedDevices } from '../../queries/dashboard.queries';

export function DevicesPieChart() {
  const { data, isLoading, isError, refetch } = useMostUsedDevices();

  const chartData = (data ?? []).map((item) => ({
    name: item.deviceType || item.facet || 'Unknown',
    value: item.count ?? 0,
  })).sort((a, b) => b.value - a.value);

  return (
    <PieChartWidget
      title="Most Used Devices"
      subtitle="Device type distribution (7 days)"
      data={isLoading ? undefined : chartData}
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
      delay={0.22}
      icon={<DevicesIcon />}
      accentGradient="linear-gradient(135deg, #0891b2 0%, #06b6d4 40%, #22d3ee 100%)"
    />
  );
}