import React from 'react';

import { Paper, Typography, Box, Skeleton, Alert, Button, useTheme } from '@mui/material';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import { useServicesPerMerchant } from '../../queries/dashboard.queries';
import { WaveOverlay } from './WaveOverlay';
import { SERVICES_PALETTE } from '../../utils/chartColors';
import type { TimePeriod } from '../../types/dashboard.types';

interface ServicesPerMerchantChartProps {
  timePeriod: TimePeriod;
}

export function ServicesPerMerchantChart({ timePeriod }: ServicesPerMerchantChartProps) {
  const { data, isLoading, isError, refetch } = useServicesPerMerchant(timePeriod);
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const chartData = React.useMemo(() => {
    if (!data) return [];
    return data.map((d) => ({
      brand: d.Brand || d.facet || 'Unknown',
      services: d.uniqueCount,
    }));
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
            background: 'linear-gradient(135deg, #3da6e1, #5cc0ed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MiscellaneousServicesIcon sx={{ color: '#fff', fontSize: 18 }} />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Services Used per Merchant
        </Typography>
      </Box>

      {isLoading ? (
        <Skeleton variant="rounded" height={280} sx={{ borderRadius: '10px' }} />
      ) : isError ? (
        <Alert severity="error" action={<Button size="small" onClick={() => refetch()}>Retry</Button>}>
          Failed to load services per merchant
        </Alert>
      ) : chartData.length === 0 ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 8 }}>
          No data found for this period.
        </Typography>
      ) : (
        <Box sx={{ width: '100%', height: Math.max(280, chartData.length * 36), position: 'relative', zIndex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
              <defs>
                {chartData.map((_, i) => (
                  <linearGradient key={i} id={`servicesPerMerchant-${i}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={SERVICES_PALETTE[i % SERVICES_PALETTE.length]} stopOpacity={0.85} />
                    <stop offset="100%" stopColor={SERVICES_PALETTE[i % SERVICES_PALETTE.length]} stopOpacity={1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: axisTickColor }} tickLine={false} axisLine={{ stroke: gridStroke }} />
              <YAxis
                type="category"
                dataKey="brand"
                tick={{ fontSize: 11, fill: axisTickColor }}
                tickLine={false}
                axisLine={false}
                width={120}
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
                cursor={{ fill: isLight ? 'rgba(61,166,225,0.06)' : 'rgba(61,166,225,0.08)' }}
              />
              <Bar
                dataKey="services"
                radius={[0, 6, 6, 0]}
                barSize={20}
                shape={(props: any) => {
                  const { x, y, width, height, index } = props;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      rx={6}
                      fill={`url(#servicesPerMerchant-${index})`}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}

      <WaveOverlay color={isLight ? '#3da6e1' : '#5cc0ed'} opacity={isLight ? 0.04 : 0.06} height={45} />
    </Paper>
  );
}