import React from 'react';
import { motion } from 'framer-motion';

import { Box, Typography, useTheme } from '@mui/material';

import { DauTrendChart } from './DauTrendChart';
import { StickinessScoreCard } from './StickinessScoreCard';
import { EngagementTrendChart } from './EngagementTrendChart';
import { TopReturningMerchants } from './TopReturningMerchants';
import { AppsPerMerchantChart } from './AppsPerMerchantChart';
import { ServicesPerMerchantChart } from './ServicesPerMerchantChart';

import type { TimePeriod } from '../../types/dashboard.types';

interface CohortRetentionProps {
  timePeriod: TimePeriod;
}

export function CohortRetention({ timePeriod }: CohortRetentionProps) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '1.1rem',
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            component="span"
            sx={{
              width: 4,
              height: 22,
              borderRadius: 2,
              background: 'linear-gradient(180deg, #7c3aed, #a78bfa)',
              display: 'inline-block',
            }}
          />
          Brand Stickiness Overview
        </Typography>
      </motion.div>

      {/* Row 1: DAU Trend + Stickiness Score */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <DauTrendChart timePeriod={timePeriod} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <StickinessScoreCard timePeriod={timePeriod} />
        </motion.div>
      </Box>

      {/* Row 2: Engagement Trend + Top Returning Merchants */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <EngagementTrendChart timePeriod={timePeriod} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
        >
          <TopReturningMerchants timePeriod={timePeriod} />
        </motion.div>
      </Box>

      {/* Row 3: Apps per Merchant + Services per Merchant */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
        >
          <AppsPerMerchantChart timePeriod={timePeriod} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
        >
          <ServicesPerMerchantChart timePeriod={timePeriod} />
        </motion.div>
      </Box>
    </Box>
  );
}