import React from 'react';
import { motion } from 'framer-motion';

import { Box, Paper, Typography, Skeleton, Alert, Button, useTheme } from '@mui/material';

interface MetricWidgetProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  index: number;
  accentColor?: string;
  accentGradient?: string;
  onClick?: () => void;
}

export function MetricWidget({
  icon,
  title,
  value,
  subtitle,
  isLoading,
  isError,
  refetch,
  index,
  accentColor = '#6366f1',
  accentGradient = 'linear-gradient(135deg, #4f46e5 0%, #6366f1 40%, #818cf8 100%)',
  onClick,
}: MetricWidgetProps) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const isClickable = !!onClick;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Paper
        elevation={0}
        onClick={onClick}
        sx={{
          p: 2.5,
          borderRadius: '14px',
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2.5,
          position: 'relative',
          overflow: 'hidden',
          cursor: isClickable ? 'pointer' : 'default',
          background: isLight
            ? 'linear-gradient(135deg, #ffffff 0%, #fafaff 100%)'
            : 'linear-gradient(135deg, #161b22 0%, #1c2030 100%)',
          transition: 'border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: accentGradient,
            opacity: 0,
            transition: 'opacity 0.25s ease',
          },
          '&:hover': {
            borderColor: accentColor,
            transform: 'translateY(-2px)',
            boxShadow: isLight
              ? `0 6px 24px ${accentColor}15, 0 0 0 1px ${accentColor}10`
              : `0 6px 24px ${accentColor}25, 0 0 0 1px ${accentColor}18`,
            '&::before': {
              opacity: 1,
            },
          },
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '14px',
            background: accentGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0,
            position: 'relative',
            boxShadow: `0 4px 14px ${accentColor}40`,
            '& .MuiSvgIcon-root': {
              fontSize: '1.5rem',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
          {icon}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              mb: 0.5,
            }}
          >
            {title}
          </Typography>
          {isLoading ? (
            <Skeleton variant="text" width={80} height={36} sx={{ borderRadius: '6px' }} />
          ) : isError ? (
            <Alert
              severity="error"
              sx={{ py: 0, px: 1, fontSize: '0.75rem' }}
              action={
                <Button size="small" onClick={(e) => { e.stopPropagation(); refetch(); }} sx={{ fontSize: '0.7rem', minWidth: 0 }}>
                  Retry
                </Button>
              }
            >
              Failed
            </Alert>
          ) : (
            <>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.25, display: 'block' }}>
                  {subtitle}
                </Typography>
              )}
            </>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
}