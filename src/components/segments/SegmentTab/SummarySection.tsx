import React from 'react';
import { Box, Typography, Paper, Skeleton, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';

import { SEGMENT_CODE_COUNT } from '../../../types/segmentCodes';

interface SummarySectionProps {
  totalSegments: number | undefined;
  totalSessions: number | undefined;
  isLoading: boolean;
}

export function SummarySection({
  totalSegments,
  totalSessions,
  isLoading,
}: SummarySectionProps) {
  const theme = useTheme();

  const renderSummaryCard = (
    label: string,
    value: number | undefined,
    icon: React.ReactNode,
    color: string
  ) => (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '8px',
        p: 2,
        backgroundColor: '#ffffff',
        border: `1px solid ${theme.palette.divider}`,
        flex: 1,
        minWidth: 0,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: color,
          boxShadow: `0 2px 8px ${color}15`,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: color,
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
          {label}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            color: color,
            display: 'flex',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        {isLoading ? (
          <Skeleton variant="text" width={80} height={32} />
        ) : (
          <Typography
            sx={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: theme.palette.text.primary,
              lineHeight: 1,
              letterSpacing: '-0.5px',
            }}
          >
            {value?.toLocaleString() ?? '—'}
          </Typography>
        )}
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ mb: 3 }}>
      {/* Top Summary Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {renderSummaryCard(
          'Total Unique Segments',
          totalSegments,
          <TrendingUpIcon sx={{ fontSize: 24 }} />,
          '#3b82f6'
        )}
        {renderSummaryCard(
          'Total Sessions',
          totalSessions,
          <PeopleIcon sx={{ fontSize: 24 }} />,
          '#059669'
        )}
        {renderSummaryCard(
          'Segment Codes',
          SEGMENT_CODE_COUNT,
          <CategoryIcon sx={{ fontSize: 24 }} />,
          '#7c3aed'
        )}
      </Box>
    </Box>
  );
}
