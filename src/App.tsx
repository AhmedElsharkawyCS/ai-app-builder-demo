import React, { useState, useCallback, useMemo } from 'react';

import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { TabBar } from './components/dashboard/TabBar';
import { FilterBar } from './components/dashboard/FilterBar';
import { ContentArea } from './components/dashboard/ContentArea';

import { useThemeMode } from './hooks/useThemeMode';
import { buildTheme } from './theme';
import type { TabId, TabConfig, FilterConfig, TimePeriod } from './types/dashboard.types';

const TABS: TabConfig[] = [
  { id: 'tab1', label: 'Executive Summary' },
  { id: 'tab2', label: 'Business Engagement' },
  { id: 'tab3', label: 'Cohort Retention' },
];

const TAB_FILTERS: Record<TabId, FilterConfig[]> = {
  tab1: [],
  tab2: [],
  tab3: [],
};

const DEFAULT_FILTER_VALUES: Record<TabId, Record<string, string>> = {
  tab1: {},
  tab2: {},
  tab3: {},
};

export default function App() {
  const { mode, toggleMode } = useThemeMode();
  const theme = useMemo(() => buildTheme(mode), [mode]);

  const [activeTab, setActiveTab] = useState<TabId>('tab1');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('1D');
  const [filterValues, setFilterValues] = useState<Record<TabId, Record<string, string>>>(
    DEFAULT_FILTER_VALUES
  );

  const handleTabChange = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
  }, []);

  const handleFilterChange = useCallback(
    (filterId: string, value: string) => {
      setFilterValues((prev) => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          [filterId]: value,
        },
      }));
    },
    [activeTab]
  );

  const handleTimePeriodChange = useCallback((period: TimePeriod) => {
    setTimePeriod(period);
  }, []);

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.default',
          transition: 'background-color 0.3s ease',
        }}
      >
        <TabBar
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onReload={handleReload}
          onToggleDarkMode={toggleMode}
          isDarkMode={mode === 'dark'}
        />

        <FilterBar
          filters={TAB_FILTERS[activeTab]}
          filterValues={filterValues[activeTab]}
          onFilterChange={handleFilterChange}
          timePeriod={timePeriod}
          onTimePeriodChange={handleTimePeriodChange}
          tabKey={activeTab}
        />

        <ContentArea activeTab={activeTab} timePeriod={timePeriod} />
      </Box>
    </ThemeProvider>
  );
}