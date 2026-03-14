import React from 'react';

import { Box, Paper, Typography, Skeleton, Alert, Button, useTheme } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

import { useMostVisitedCountries } from '../../queries/dashboard.queries';
import { WaveOverlay } from './WaveOverlay';
import { CountryFlag, getCountryName, getFlagUrl } from '../common/CountryFlag';

const COUNTRIES_PALETTE = [
  '#0d7cc0',
  '#147dc5',
  '#1a90d4',
  '#2196f3',
  '#3da6e1',
  '#42a5f5',
  '#4db8e8',
  '#5cc0ed',
  '#1565c0',
  '#0b6aaf',
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { countryCode: string; label: string; count: number } }>;
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <CountryFlag code={item.countryCode} size={16} showTooltip={false} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0d7cc0' }}>
          {item.label} ({item.countryCode})
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Visits: <strong style={{ color: isLight ? '#1a1d23' : '#e6edf3' }}>{item.count.toLocaleString()}</strong>
      </Typography>
    </Paper>
  );
}

interface CustomYAxisTickProps {
  x?: number;
  y?: number;
  payload?: { value: string };
  fill?: string;
  data?: Array<{ countryCode: string; label: string }>;
}

function CustomYAxisTick({ x = 0, y = 0, payload, fill, data = [] }: CustomYAxisTickProps) {
  const label = payload?.value || '';
  const match = data.find((d) => d.label === label);
  const code = match?.countryCode || '';

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-130} y={-12} width={125} height={24}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            justifyContent: 'flex-end',
            height: '100%',
          }}
        >
          <img
            src={getFlagUrl(code)}
            alt={code}
            style={{
              width: 22,
              height: 15,
              objectFit: 'cover',
              borderRadius: '2px',
              border: '1px solid rgba(0,0,0,0.1)',
              flexShrink: 0,
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: fill || '#1e293b',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 90,
            }}
          >
            {label}
          </span>
        </div>
      </foreignObject>
    </g>
  );
}

export function MostVisitedCountriesChart() {
  const { data, isLoading, isError, refetch } = useMostVisitedCountries();
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
          Failed to load most visited countries
        </Alert>
      </Paper>
    );
  }

  const chartData = (data ?? [])
    .map((item) => ({
      countryCode: item.countryCode || item.facet || 'Unknown',
      label: getCountryName(item.countryCode || item.facet || 'Unknown'),
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
      transition={{ duration: 0.35, delay: 0.12, ease: 'easeOut' }}
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
          <PublicIcon sx={{ fontSize: 20, color: '#0d7cc0' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
            Most Visited Countries
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Top countries by visits in the last 7 days
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
                  {COUNTRIES_PALETTE.map((color, i) => (
                    <linearGradient key={i} id={`countryBar${i}`} x1="0" y1="0" x2="1" y2="0">
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
                  tick={<CustomYAxisTick fill={yAxisTickColor} data={chartData} />}
                  axisLine={false}
                  tickLine={false}
                  width={135}
                />
                <Tooltip
                  content={<CustomTooltip isLight={isLight} />}
                  cursor={{ fill: isLight ? 'rgba(13,124,192,0.06)' : 'rgba(13,124,192,0.12)' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={26}>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={`url(#countryBar${index % COUNTRIES_PALETTE.length})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}

        <WaveOverlay
          color={isLight ? '#0d7cc0' : '#3da6e1'}
          opacity={isLight ? 0.05 : 0.07}
          height={50}
        />
      </Paper>
    </motion.div>
  );
}