import React, { useCallback } from 'react';

import { Box, Paper, Typography, Skeleton, Alert, Button, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import { motion } from 'framer-motion';

import { WaveOverlay } from './WaveOverlay';
import { PIE_PALETTE } from '../../utils/chartColors';

interface PieChartItem {
  name: string;
  value: number;
}

interface PieChartWidgetProps {
  title: string;
  subtitle: string;
  data: PieChartItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  delay?: number;
  icon: React.ReactNode;
  accentGradient: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: PieChartItem; value: number }>;
  isLight: boolean;
  total: number;
}

function CustomTooltip({ active, payload, isLight, total }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
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
        {item.name}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Count: <strong style={{ color: isLight ? '#1a1d23' : '#e6edf3' }}>{item.value.toLocaleString()}</strong>
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Share: <strong style={{ color: isLight ? '#1a1d23' : '#e6edf3' }}>{pct}%</strong>
      </Typography>
    </Paper>
  );
}

function renderActiveShape(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
}

export function PieChartWidget({
  title,
  subtitle,
  data,
  isLoading,
  isError,
  refetch,
  delay = 0.15,
  icon,
  accentGradient,
}: PieChartWidgetProps) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined);

  const onPieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);

  const onPieLeave = useCallback(() => {
    setActiveIndex(undefined);
  }, []);

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
          Failed to load {title.toLowerCase()}
        </Alert>
      </Paper>
    );
  }

  const total = (data ?? []).reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
    >
      <Paper
        sx={{
          p: 3,
          borderRadius: '14px',
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: isLight
            ? 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
            : 'linear-gradient(135deg, #161b22 0%, #1a2030 100%)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: accentGradient,
              color: '#fff',
              fontSize: 20,
              flexShrink: 0,
              '& .MuiSvgIcon-root': { fontSize: 20 },
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          {subtitle}
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, py: 2 }}>
            <Skeleton variant="circular" width={180} height={180} />
          </Box>
        ) : !data || data.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4, flex: 1 }}>
            No data available
          </Typography>
        ) : (
          <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ width: '100%', height: 220, position: 'relative', zIndex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                    strokeWidth={0}
                  >
                    {data.map((_, index) => (
                      <Cell
                        key={index}
                        fill={PIE_PALETTE[index % PIE_PALETTE.length]}
                        style={{ filter: activeIndex === index ? 'brightness(1.15)' : 'none', transition: 'filter 0.2s ease' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip isLight={isLight} total={total} />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, px: 1, zIndex: 1, position: 'relative' }}>
              {data.map((item, index) => {
                const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
                return (
                  <Box
                    key={item.name}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1,
                      py: 0.5,
                      borderRadius: '6px',
                      backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)',
                      transition: 'background-color 0.2s ease',
                      '&:hover': {
                        backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '3px',
                        backgroundColor: PIE_PALETTE[index % PIE_PALETTE.length],
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.primary', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                      {pct}%
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        <WaveOverlay
          color={isLight ? '#147dc5' : '#3da6e1'}
          opacity={isLight ? 0.04 : 0.06}
          height={40}
        />
      </Paper>
    </motion.div>
  );
}