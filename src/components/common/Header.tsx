import React, { useCallback } from 'react';

import { AppBar, Toolbar, Box, Tabs, Tab, Typography, Chip, useTheme } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useQueryClient } from '@tanstack/react-query';
import { TAB_LABELS, REFRESH_SECONDS, LIVE_PULSE_SX } from '../../utils/constants';
import { useCountdown } from '../../hooks';

interface HeaderProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const handleCountdownComplete = useCallback(() => {
    // Invalidate all queries (New Relic + MongoDB segments)
    queryClient.invalidateQueries();
  }, [queryClient]);

  const countdown = useCountdown({
    seconds: REFRESH_SECONDS,
    onComplete: handleCountdownComplete,
  });

  const isUrgent = countdown <= 5;

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'rgba(249, 249, 249, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          px: 4,
          py: '18px',
          minHeight: 'auto !important',
          display: 'flex',
          alignItems: 'center',
          gap: '11px',
        }}
      >
        {/* Tabs */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => onTabChange(v)}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{ style: { display: 'none' } }}
            sx={{
              minHeight: 'auto',
              '& .MuiTabs-flexContainer': {
                gap: 1,
                alignItems: 'center',
              },
            }}
          >
            {TAB_LABELS.map((label) => (
              <Tab key={label} label={label} />
            ))}
          </Tabs>
        </Box>

        {/* Countdown refresher */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.disabled, fontWeight: 400, whiteSpace: 'nowrap' }}>
              Auto-refresh in
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: isUrgent ? '#ef4444' : theme.palette.primary.main,
                transition: 'color 0.3s ease',
                minWidth: '20px',
              }}
            >
              {countdown}s
            </Typography>
          </Box>

          <Chip
            icon={
              <FiberManualRecordIcon
                sx={{ fontSize: '8px !important', color: '#059669 !important', ...LIVE_PULSE_SX }}
              />
            }
            label="Live"
            size="small"
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              height: 22,
              backgroundColor: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0',
              '& .MuiChip-label': { px: 1 },
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}