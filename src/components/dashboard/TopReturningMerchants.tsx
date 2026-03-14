import React from 'react';
import { motion } from 'framer-motion';

import {
  Paper,
  Typography,
  Box,
  Skeleton,
  Alert,
  Button,
  Avatar,
  Chip,
  useTheme,
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

import { useTopReturningMerchants } from '../../queries/dashboard.queries';
import { formatNumber } from '../../utils/format';
import type { TimePeriod } from '../../types/dashboard.types';

interface TopReturningMerchantsProps {
  timePeriod: TimePeriod;
}

const RANK_GRADIENTS = [
  'linear-gradient(135deg, #f59e0b, #fbbf24)',
  'linear-gradient(135deg, #94a3b8, #cbd5e1)',
  'linear-gradient(135deg, #d97706, #f97316)',
];

const RANK_SHADOWS = [
  '0 2px 8px rgba(245,158,11,0.4)',
  '0 2px 8px rgba(148,163,184,0.4)',
  '0 2px 8px rgba(217,119,6,0.4)',
];

export function TopReturningMerchants({ timePeriod }: TopReturningMerchantsProps) {
  const { data, isLoading, isError, refetch } = useTopReturningMerchants(timePeriod);
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '14px',
        border: '1px solid',
        borderColor: 'divider',
        background: isLight
          ? 'linear-gradient(135deg, #ffffff 0%, #fffcf5 100%)'
          : 'linear-gradient(135deg, #161b22 0%, #1e2028 100%)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ReplayIcon sx={{ color: '#fff', fontSize: 18 }} />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Top Returning Merchants
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={48} sx={{ borderRadius: '8px' }} />
          ))}
        </Box>
      ) : isError ? (
        <Alert severity="error" action={<Button size="small" onClick={() => refetch()}>Retry</Button>}>
          Failed to load returning merchants
        </Alert>
      ) : !data || data.length === 0 ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
          No returning merchants found for this period.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {data.map((merchant, i) => (
            <motion.div
              key={merchant.facet || i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.25,
                  borderRadius: '10px',
                  backgroundColor: i < 3
                    ? (isLight ? 'rgba(245,158,11,0.04)' : 'rgba(245,158,11,0.08)')
                    : 'transparent',
                  transition: 'background-color 0.15s ease',
                  '&:hover': {
                    backgroundColor: isLight ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.14)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: i < 3 ? RANK_GRADIENTS[i] : (isLight ? '#e8ecf4' : '#30363d'),
                    color: i < 3 ? '#fff' : 'text.secondary',
                    boxShadow: i < 3 ? RANK_SHADOWS[i] : 'none',
                  }}
                >
                  {i + 1}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                    {merchant.Brand || merchant.facet || 'Unknown'}
                  </Typography>
                </Box>
                <Chip
                  label={`${formatNumber(merchant.count)} visits`}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    backgroundColor: isLight ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.18)',
                    color: '#f59e0b',
                  }}
                />
              </Box>
            </motion.div>
          ))}
        </Box>
      )}
    </Paper>
  );
}