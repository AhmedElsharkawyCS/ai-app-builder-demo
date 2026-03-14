import React from 'react';

import LanguageIcon from '@mui/icons-material/Language';

import { PieChartWidget } from './PieChartWidget';
import { useMostUsedBrowsers } from '../../queries/dashboard.queries';

export function BrowsersPieChart() {
  const { data, isLoading, isError, refetch } = useMostUsedBrowsers();

  const chartData = (data ?? []).map((item) => ({
    name: item.userAgentName || item.facet || 'Unknown',
    value: item.count ?? 0,
  })).sort((a, b) => b.value - a.value);

  return (
    <PieChartWidget
      title="Most Used Browsers"
      subtitle="Browser distribution (7 days)"
      data={isLoading ? undefined : chartData}
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
      delay={0.25}
      icon={<LanguageIcon />}
      accentGradient="linear-gradient(135deg, #7c3aed 0%, #8b5cf6 40%, #a78bfa 100%)"
    />
  );
}