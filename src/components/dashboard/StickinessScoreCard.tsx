import React from 'react';
import { motion } from 'framer-motion';

import { Paper, Typography, Box, Skeleton, Alert, Button, useTheme } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';

import { useStickinessDau, useStickinessMau } from '../../queries/dashboard.queries';
import type { TimePeriod } from '../../types/dashboard.types';

interface StickinessScoreCardProps {
  timePeriod: TimePeriod;
}

export function StickinessScoreCard({ timePeriod }: StickinessScoreCardProps) {
  const dau = useStickinessDau(timePeriod);
  const mau = useStickinessMau();
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const dauVal = dau.data?.[0]?.uniqueCount ?? 0;
  const mauVal = mau.data?.[0]?.uniqueCount ?? 0;
  const score = mauVal > 0 ? ((dauVal / mauVal) * 100) : 0;
  const isLoading = dau.isLoading || mau.isLoading;
  const isError = dau.isError || mau.isError;

  const scoreColor = score >= 50 ? '#10b981' : score >= 25 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (circumference * Math.min(score, 100)) / 100;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '14px',
        border: '1px solid',
        borderColor: 'divider',
        background: isLight
          ? 'linear-gradient(135deg, #ffffff 0%, #faf8ff 100%)'
          : 'linear-gradient(135deg, #161b22 0%, #1c1a2e 100%)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SpeedIcon sx={{ color: '#fff', fontSize: 18 }} />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          DAU / MAU Stickiness Score
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
          <Skeleton variant="circular" width={130} height={130} />
          <Skeleton variant="text" width={120} height={24} />
        </Box>
      ) : isError ? (
        <Alert
          severity="error"
          action={<Button size="small" onClick={() => { dau.refetch(); mau.refetch(); }}>Retry</Button>}
        >
          Failed to load stickiness data
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 1 }}>
          <Box sx={{ position: 'relative', width: 130, height: 130 }}>
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r="54" fill="none" stroke={isLight ? '#e2e8f0' : '#21262d'} strokeWidth="10" />
              <motion.circle
                cx="65"
                cy="65"
                r="54"
                fill="none"
                stroke={scoreColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                transform="rotate(-90 65 65)"
              />
            </svg>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
                {score.toFixed(1)}%
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, mt: 0.25 }}>
                Stickiness
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'text.primary' }}>
                {dauVal}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Active Brands
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'text.primary' }}>
                {mauVal}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Monthly Brands
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
}