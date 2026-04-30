import React from 'react';

import { Box, Typography, Paper, Skeleton, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

import type { BarSlice } from '../../types/segments.types';
import { PALETTE, CustomTooltip } from './shared/chartConfig';
import { truncate } from '../../utils/formatters';

interface BarChartCardProps {
  title: string;
  data: BarSlice[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

interface BarTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: BarSlice }>;
  label?: string;
}

function BarTooltip({ active, payload, label }: BarTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return <CustomTooltip active={active} label={label} value={payload[0].value} unit="events" />;
}

export function BarChartCard({ title, data, isLoading, isError }: BarChartCardProps) {
  const theme = useTheme();
  const hasData = !isLoading && !isError && data && data.length > 0;
  const isEmpty = !isLoading && !isError && (!data || data.length === 0);

  // Show top 15 bars at most to keep chart readable
  const chartData = hasData ? data!.slice(0, 15) : [];

  // Dynamic height: 40px per bar with a min of 200 and max of 520
  const barHeight = 40;
  const chartHeight = hasData
    ? Math.min(Math.max(chartData.length * barHeight, 200), 520)
    : 220;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '8px',
        p: 2,
        backgroundColor: '#ffffff',
        border: `1px solid ${theme.palette.divider}`,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 2px 8px ${theme.palette.primary.main}15`,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: theme.palette.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {title}
        </Typography>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[90, 70, 80, 55, 65, 50].map((w, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Skeleton variant="text" width={80} height={16} sx={{ borderRadius: '4px', flexShrink: 0 }} />
              <Skeleton variant="rectangular" width={`${w}%`} height={24} sx={{ borderRadius: '4px' }} />
            </Box>
          ))}
        </Box>
      )}

      {isError && (
        <Box
          sx={{
            height: 220,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ fontSize: '0.8125rem', color: '#dc2626' }}>
            Failed to load data
          </Typography>
        </Box>
      )}

      {isEmpty && (
        <Box
          sx={{
            height: 220,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ fontSize: '0.8125rem', color: '#9ca3af' }}>
            No data available
          </Typography>
        </Box>
      )}

      {hasData && (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) =>
                v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
              }
            />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: string) => truncate(v, 16)}
            />
            <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(20,125,197,0.06)' }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}