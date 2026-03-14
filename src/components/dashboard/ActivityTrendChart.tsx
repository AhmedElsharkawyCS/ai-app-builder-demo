import React from 'react';

import { Paper, Typography, Box, Skeleton, Alert, Button, Chip, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import { useActivityTrend } from '../../queries/dashboard.queries';
import { formatTimestamp } from '../../utils/format';
import { APPS_PALETTE } from '../../utils/chartColors';
import { WaveOverlay } from './WaveOverlay';
import type { TimePeriod } from '../../types/dashboard.types';

interface ActivityTrendChartProps {
  timePeriod: TimePeriod;
  selectedBrand?: string | null;
}

interface ChartRow {
  time: string;
  [appCode: string]: string | number;
}

export function ActivityTrendChart({ timePeriod, selectedBrand }: ActivityTrendChartProps) {
  const { data, isLoading, isError, refetch } = useActivityTrend(timePeriod, selectedBrand);
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const { chartData, appCodes } = React.useMemo(() => {
    if (!data || data.length === 0) return { chartData: [] as ChartRow[], appCodes: [] as string[] };

    const codesSet = new Set<string>();
    const timeMap = new Map<number, ChartRow>();

    for (const d of data) {
      const code = d.facet || d.appCode || 'Unknown';
      codesSet.add(code);
      const ts = d.beginTimeSeconds;
      if (!timeMap.has(ts)) {
        timeMap.set(ts, { time: formatTimestamp(ts) });
      }
      const row = timeMap.get(ts)!;
      row[code] = d.count;
    }

    const codes = Array.from(codesSet);
    const rows = Array.from(timeMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([, row]) => {
        for (const c of codes) {
          if (row[c] === undefined) row[c] = 0;
        }
        return row;
      });

    return { chartData: rows, appCodes: codes };
  }, [data]);

  const gridStroke = isLight ? '#e2e8f0' : '#21262d';
  const axisTickColor = isLight ? '#64748b' : '#8b949e';

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
          ? 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          : 'linear-gradient(135deg, #161b22 0%, #1a1f2e 100%)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #147dc5, #3da6e1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TrendingUpIcon sx={{ color: '#fff', fontSize: 18 }} />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1 }}>
          Merchant Activity Trend
        </Typography>
        {selectedBrand && (
          <Chip
            label={selectedBrand}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.7rem',
              backgroundColor: isLight ? 'rgba(20,125,197,0.1)' : 'rgba(61,166,225,0.18)',
              color: '#147dc5',
            }}
          />
        )}
      </Box>

      {isLoading ? (
        <Skeleton variant="rounded" height={300} sx={{ borderRadius: '10px' }} />
      ) : isError ? (
        <Alert
          severity="error"
          action={<Button size="small" onClick={() => refetch()}>Retry</Button>}
        >
          Failed to load activity trend
        </Alert>
      ) : chartData.length === 0 ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 8 }}>
          No activity data found for this period.
        </Typography>
      ) : (
        <Box sx={{ width: '100%', height: 300, position: 'relative', zIndex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <defs>
                {appCodes.map((code, i) => {
                  const color = APPS_PALETTE[i % APPS_PALETTE.length];
                  return (
                    <linearGradient key={code} id={`trendGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.20} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: axisTickColor }}
                tickLine={false}
                axisLine={{ stroke: gridStroke }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: axisTickColor }}
                tickLine={false}
                axisLine={false}
                width={45}
              />
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
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                iconType="circle"
                iconSize={8}
              />
              {appCodes.map((code, i) => {
                const color = APPS_PALETTE[i % APPS_PALETTE.length];
                return (
                  <Area
                    key={code}
                    type="monotone"
                    dataKey={code}
                    name={code}
                    stroke={color}
                    strokeWidth={2}
                    fill={`url(#trendGrad-${i})`}
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: color,
                      stroke: isLight ? '#fff' : '#161b22',
                      strokeWidth: 2,
                    }}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      )}

      <WaveOverlay
        color={isLight ? '#147dc5' : '#3da6e1'}
        opacity={isLight ? 0.04 : 0.06}
        height={45}
      />
    </Paper>
  );
}