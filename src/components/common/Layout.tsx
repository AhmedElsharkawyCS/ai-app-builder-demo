import React, { useState } from 'react';

import { Box } from '@mui/material';

import { Header } from './Header';
import { ExecutiveSummaryTab } from '../ExecutiveSummaryTab';
import { BrandActivityTab } from '../BrandActivityTab';
import { SegmentTab } from '../SegmentTab';
import { ApplicationsTab } from '../ApplicationsTab';
import { CountriesTab } from '../CountriesTab';

const TABS = [
  <ExecutiveSummaryTab key="executive" />,
  <BrandActivityTab key="live" />,
  <SegmentTab key="segment" />,
  <ApplicationsTab key="applications" />,
  <CountriesTab key="countries" />,
];

export function Layout() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(249, 249, 249, 0.8)' }}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: 0,
          pt: '72px',
          px: 3,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          backgroundColor: '#ffffff',
        }}
        id="box-main"
      >
        {TABS[activeTab]}
      </Box>
    </Box>
  );
}
