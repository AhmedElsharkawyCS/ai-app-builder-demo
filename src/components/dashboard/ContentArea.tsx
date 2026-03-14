import React from 'react';
import { motion } from 'framer-motion';

import { Box, useTheme } from '@mui/material';

import { ExecutiveSummary } from './ExecutiveSummary';
import { RadarWhoIsOnline } from './RadarWhoIsOnline';
import { CohortRetention } from './CohortRetention';

import type { TabId, TimePeriod } from '../../types/dashboard.types';

interface ContentAreaProps {
  activeTab: TabId;
  timePeriod: TimePeriod;
}

export function ContentArea({ activeTab, timePeriod }: ContentAreaProps) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Box
      sx={{
        flex: 1,
        p: 3,
        overflow: 'auto',
        background: isLight
          ? 'linear-gradient(160deg, #f0f2f5 0%, #e8ecf4 40%, #f0f2f5 100%)'
          : 'linear-gradient(160deg, #0d1117 0%, #131a24 40%, #0d1117 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '20%',
          width: '60%',
          height: '300px',
          background: isLight
            ? 'radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        {activeTab === 'tab1' && <ExecutiveSummary timePeriod={timePeriod} />}
        {activeTab === 'tab2' && <RadarWhoIsOnline timePeriod={timePeriod} />}
        {activeTab === 'tab3' && <CohortRetention timePeriod={timePeriod} />}
      </motion.div>
    </Box>
  );
}