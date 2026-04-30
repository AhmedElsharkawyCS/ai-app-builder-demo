import React from 'react';

import { Box, Typography, Paper, Skeleton, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Props as LegendProps } from 'recharts/types/component/DefaultLegendContent';

import type { PieSlice } from '../../types/segments.types';
import { PALETTE, CustomTooltip } from './shared/chartConfig';

interface PieChartCardProps {
  title: string;
  data: PieSlice[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: PieSlice }>;
}

function PieTooltip({ active, payload }: PieTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0];
  return <CustomTooltip active={active} label={item.name} value={item.value} unit="sessions" />;
}

function renderLegend(props: LegendProps) {
  const { payload } = props;
  if (!payload) return null;
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '6px 12px',
        mt: 1,
      }}
    >
      {payload.map((entry, idx) => (
        <Box key={`${String(entry.value)}-${idx}`} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: entry.color ?? '#ccc',
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              fontSize: '0.6875rem',
              color: '#6b7280',
              fontWeight: 500,
              maxWidth: 90,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {String(entry.value)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export function PieChartCard({ title, data, isLoading, isError }: PieChartCardProps) {
  const theme = useTheme();
  const hasData = !isLoading && !isError && data && data.length > 0;
  const isEmpty = !isLoading && !isError && (!data || data.length === 0);

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
          <Skeleton variant="circular" width={160} height={160} />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[80, 60, 70, 50].map((w, i) => (
              <Skeleton key={i} variant="text" width={w} height={18} sx={{ borderRadius: '4px' }} />
            ))}
          </Box>
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
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data!.map((_, index) => (
                <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}