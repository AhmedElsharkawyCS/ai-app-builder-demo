import React from 'react';

import { Box, Paper, Typography, Skeleton, Alert, Button, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

import { useMostVisitedApps } from '../../queries/dashboard.queries';
import { APPS_PALETTE } from '../../utils/chartColors';
import { WaveOverlay } from './WaveOverlay';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { appCode: string; count: number } }>;
  isLight: boolean;
}

function CustomTooltip({ active, payload, isLight }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <Paper
      elevation={4}
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: '10px',
        border: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
        background: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(22,27,34,0.95)',
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#147dc5', mb: 0.5 }}>
        {item.appCode}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Visits: <strong style={{ color: isLight ? '#1a1d23' : '#e6edf3' }}>{item.count.toLocaleString()}</strong>
      </Typography>
    </Paper>
  );
}

export function MostVisitedAppsChart() {
  const { data, isLoading, isError, refetch } = useMostVisitedApps();
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  if (isError) {
    return (
      <Paper sx={{ p: 3, borderRadius: '14px' }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          Failed to load most visited apps
        </Alert>
      </Paper>
    );
  }

  const chartData = (data ?? [])
    .map((item) => ({
      appCode: item.appCode || item.facet || 'Unknown',
      count: item.count ?? 0,
    }))
    .sort((a, b) => b.count - a.count);

  const gridStroke = isLight ? '#e2e8f0' : '#21262d';
  const axisTickColor = isLight ? '#64748b' : '#8b949e';
  const yAxisTickColor = isLight ? '#1e293b' : '#e6edf3';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
    >
      <Paper
        sx={{
          p: 3,
          borderRadius: '14px',
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          overflow: 'hidden',
          background: isLight
            ? 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
            : 'linear-gradient(135deg, #161b22 0%, #1a2030 100%)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1rem' }}>
          Most Visited Apps
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Top apps opened in the last 7 days
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={28} sx={{ borderRadius: '6px' }} />
            ))}
          </Box>
        ) : chartData.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
            No data available
          </Typography>
        ) : (
          <Box sx={{ width: '100%', height: 360, position: 'relative', zIndex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 0, right: 24, bottom: 0, left: 8 }}
              >
                <defs>
                  {APPS_PALETTE.map((color, i) => (
                    <linearGradient key={i} id={`appBar${i}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={color} stopOpacity={0.85} />
                      <stop offset="100%" stopColor={color} stopOpacity={1} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12, fill: axisTickColor }}
                  axisLine={{ stroke: gridStroke }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="appCode"
                  tick={{ fontSize: 12, fill: yAxisTickColor, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  width={120}
                />
                <Tooltip
                  content={<CustomTooltip isLight={isLight} />}
                  cursor={{ fill: isLight ? 'rgba(20,125,197,0.06)' : 'rgba(20,125,197,0.12)' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={26}>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={`url(#appBar${index % APPS_PALETTE.length})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}

        <WaveOverlay
          color={isLight ? '#147dc5' : '#3da6e1'}
          opacity={isLight ? 0.05 : 0.07}
          height={50}
        />
      </Paper>
    </motion.div>
  );
}