import React from 'react';

import { Paper, Typography, Box, Skeleton, Alert, Button, useTheme } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import { useDailyActiveMerchantsTrend } from '../../queries/dashboard.queries';
import { formatTimestamp } from '../../utils/format';
import { WaveOverlay } from './WaveOverlay';
import type { TimePeriod } from '../../types/dashboard.types';

interface DauTrendChartProps {
  timePeriod: TimePeriod;
}

export function DauTrendChart({ timePeriod }: DauTrendChartProps) {
  const { data, isLoading, isError, refetch } = useDailyActiveMerchantsTrend(timePeriod);
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const chartData = React.useMemo(() => {
    if (!data) return [];
    return data.map((d) => ({
      time: formatTimestamp(d.beginTimeSeconds),
      merchants: d.uniqueCount,
    }));
  }, [data]);

  const gridStroke = isLight ? '#e2e8f0' : '#21262d';
  const axisTickColor = isLight ? '#64748b' : '#8b949e';
  const lineColor = isLight ? '#7c3aed' : '#a78bfa';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '14px',
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
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
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShowChartIcon sx={{ color: '#fff', fontSize: 18 }} />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Daily Active Merchants Trend
        </Typography>
      </Box>

      {isLoading ? (
        <Skeleton variant="rounded" height={260} sx={{ borderRadius: '10px' }} />
      ) : isError ? (
        <Alert severity="error" action={<Button size="small" onClick={() => refetch()}>Retry</Button>}>
          Failed to load DAU trend
        </Alert>
      ) : chartData.length === 0 ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 8 }}>
          No data found for this period.
        </Typography>
      ) : (
        <Box sx={{ width: '100%', height: 260, position: 'relative', zIndex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="dauGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lineColor} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={lineColor} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: axisTickColor }} tickLine={false} axisLine={{ stroke: gridStroke }} />
              <YAxis tick={{ fontSize: 11, fill: axisTickColor }} tickLine={false} axisLine={false} width={45} />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: `1px solid ${isLight ? '#d8dee4' : '#30363d'}`,
                  fontSize: 12,
                  boxShadow: isLight ? '0 4px 16px rgba(0,0,0,0.08)' : '0 4px 16px rgba(0,0,0,0.4)',
                  backgroundColor: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(22,27,34,0.95)',
                  color: isLight ? '#1a1d23' : '#e6edf3',
                  backdropFilter: 'blur(8px)',
                }}
              />
              <Area
                type="monotone"
                dataKey="merchants"
                stroke={lineColor}
                strokeWidth={2.5}
                fill="url(#dauGradient)"
                dot={false}
                activeDot={{ r: 5, fill: lineColor, stroke: isLight ? '#fff' : '#161b22', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      )}

      <WaveOverlay color={isLight ? '#7c3aed' : '#a78bfa'} opacity={isLight ? 0.04 : 0.06} height={45} />
    </Paper>
  );
}