import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

export const PALETTE = [
  '#147dc5',
  '#3da6e1',
  '#059669',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#10b981',
  '#f97316',
  '#6366f1',
  '#14b8a6',
];

interface CustomTooltipProps {
  active?: boolean;
  label?: string;
  value?: number;
  unit?: string;
}

export function CustomTooltip({ active, label, value, unit = '' }: CustomTooltipProps) {
  const theme = useTheme();
  
  if (!active || !label || value === undefined) return null;
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '8px',
        px: 1.5,
        py: 1,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: theme.palette.text.primary }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>
        {value.toLocaleString()} {unit}
      </Typography>
    </Box>
  );
}
