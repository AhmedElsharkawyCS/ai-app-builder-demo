import React, { useState } from 'react';

import { Box } from '@mui/material';

import { TopActiveMerchants } from './TopActiveMerchants';
import { ActivityTrendChart } from './ActivityTrendChart';
import { EngagementDepthTable } from './EngagementDepthTable';

import type { TimePeriod } from '../../types/dashboard.types';

interface RadarWhoIsOnlineProps {
  timePeriod: TimePeriod;
}

export function RadarWhoIsOnline({ timePeriod }: RadarWhoIsOnlineProps) {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1.5fr' },
          gap: 2.5,
        }}
      >
        <TopActiveMerchants
          timePeriod={timePeriod}
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
        />
        <ActivityTrendChart
          timePeriod={timePeriod}
          selectedBrand={selectedBrand}
        />
      </Box>
      <EngagementDepthTable
        timePeriod={timePeriod}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
      />
    </Box>
  );
}