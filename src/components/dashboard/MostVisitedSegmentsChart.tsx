import React from 'react';

import { Box, Paper, Typography, Skeleton, Alert, Button, useTheme } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

import { useMostVisitedSegments } from '../../queries/dashboard.queries';
import { WaveOverlay } from './WaveOverlay';

const SEGMENTS_PALETTE = [
  '#147dc5',
  '#0d7cc0',
  '#3da6e1',
  '#1a90d4',
  '#2196f3',
  '#4db8e8',
  '#1565c0',
  '#42a5f5',
  '#0b6aaf',
  '#5cc0ed',
];

function extractSegmentLabel(item: { facet: string | string[]; segmentCode: string; segmentName: string }): { code: string; name: string } {
  if (Array.isArray(item.facet) && item.facet.length >= 2) {
    return { code: item.facet[0] || 'Unknown', name: item.facet[1] || item.facet[0] || 'Unknown' };
  }
  if (item.segmentName && item.segmentCode) {
    return { code: item.segmentCode, name: item.segmentName };
  }
  const facetStr = typeof item.facet === 'string' ? item.facet : 'Unknown';
  return { code: item.segmentCode || facetStr, name: item.segmentName || facetStr };
}

interface ChartItem {
  segmentCode: string;
  segmentName: string;
  label: string;
  count: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: ChartItem }>;
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
        {item.segmentName} ({item.segmentCode})
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Visits: <strong style={{ color: isLight ? '#1a1d23' : '#e6edf3' }}>{item.count.toLocaleString()}</strong>
      </Typography>
    </Paper>
  );
}

export function MostVisitedSegmentsChart() {
  const { data, isLoading, isError, refetch } = useMostVisitedSegments();
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
          Failed to load most visited segments
        </Alert>
      </Paper>
    );
  }

  const chartData: ChartItem[] = (data ?? [])
    .map((item) => {
      const { code, name } = extractSegmentLabel(item);
      return {
        segmentCode: code,
        segmentName: name,
        label: name,
        count: item.count ?? 0,
      };
    })
    .sort((a, b) => b.count - a.count);

  const gridStroke = isLight ? '#e2e8f0' : '#21262d';
  const axisTickColor = isLight ? '#64748b' : '#8b949e';
  const yAxisTickColor = isLight ? '#1e293b' : '#e6edf3';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.14, ease: 'easeOut' }}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <CategoryIcon sx={{ fontSize: 20, color: '#147dc5' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
            Most Visited Segments
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Top segments by visits in the last 7 days
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
                  {SEGMENTS_PALETTE.map((color, i) => (
                    <linearGradient key={i} id={`segmentBar${i}`} x1="0" y1="0" x2="1" y2="0">
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
                  dataKey="label"
                  tick={{ fontSize: 12, fill: yAxisTickColor, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  width={130}
                />
                <Tooltip
                  content={<CustomTooltip isLight={isLight} />}
                  cursor={{ fill: isLight ? 'rgba(20,125,197,0.06)' : 'rgba(20,125,197,0.12)' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={26}>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={`url(#segmentBar${index % SEGMENTS_PALETTE.length})`} />
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