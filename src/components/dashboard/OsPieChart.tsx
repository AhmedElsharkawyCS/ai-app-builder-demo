import React from 'react';

import ComputerIcon from '@mui/icons-material/Computer';

import { PieChartWidget } from './PieChartWidget';
import { useMostUsedOperatingSystems } from '../../queries/dashboard.queries';

export function OsPieChart() {
  const { data, isLoading, isError, refetch } = useMostUsedOperatingSystems();

  const chartData = (data ?? []).map((item) => ({
    name: item.userAgentOS || item.facet || 'Unknown',
    value: item.count ?? 0,
  })).sort((a, b) => b.value - a.value);

  return (
    <PieChartWidget
      title="Most Used Operating Systems"
      subtitle="OS distribution (7 days)"
      data={isLoading ? undefined : chartData}
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
      delay={0.28}
      icon={<ComputerIcon />}
      accentGradient="linear-gradient(135deg, #d97706 0%, #f59e0b 40%, #fbbf24 100%)"
    />
  );
}