import React from 'react';
import { motion } from 'framer-motion';

import { Box, Typography, IconButton, Tooltip, useTheme } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import type { TabId, TabConfig } from '../../types/dashboard.types';

interface TabBarProps {
  tabs: TabConfig[];
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  onReload?: () => void;
  onToggleDarkMode?: () => void;
  isDarkMode?: boolean;
}

export function TabBar({ tabs, activeTab, onTabChange, onReload, onToggleDarkMode, isDarkMode }: TabBarProps) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Box
      sx={{
        backgroundColor: isLight ? 'rgba(249, 249, 249, 0.8)' : '#1a1a1a',
        px: 2,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        minHeight: 70,
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Tabs */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          flex: 1,
          minWidth: 0,
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <TabItem
              key={tab.id}
              tab={tab}
              isActive={isActive}
              onClick={() => onTabChange(tab.id)}
            />
          );
        })}
      </Box>

      {/* Dark mode toggle */}
      <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'} placement="bottom">
        <IconButton
          size="small"
          onClick={onToggleDarkMode}
          aria-label="Toggle dark mode"
          sx={{
            color: isLight ? '#555' : '#e8eaed',
            ml: 0.5,
            '&:hover': {
              backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
              color: '#147dc5',
            },
          }}
        >
          {isDarkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      {/* Reload icon pinned to the right */}
      <Tooltip title="Reload" placement="bottom">
        <IconButton
          size="small"
          onClick={onReload}
          aria-label="Reload"
          sx={{
            color: isLight ? '#555' : '#e8eaed',
            ml: 0.5,
            '&:hover': {
              backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
              color: '#147dc5',
            },
          }}
        >
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

interface TabItemProps {
  tab: TabConfig;
  isActive: boolean;
  onClick: () => void;
}

function TabItem({ tab, isActive, onClick }: TabItemProps) {
  const [hovered, setHovered] = React.useState(false);
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const highlighted = isActive || hovered;

  const highlightBg = isLight ? '#ffffff' : '#2a2a2a';
  const textActive = '#147dc5';
  const textInactive = isLight ? '#555' : '#9aa0a6';

  return (
    <Box
      role="tab"
      aria-selected={isActive}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: 'relative',
        px: 2.5,
        py: 1,
        cursor: 'pointer',
        userSelect: 'none',
        outline: 'none',
        borderRadius: '6px',
        backgroundColor: highlighted ? highlightBg : 'transparent',
        transition: 'background-color 0.18s ease',
        '&:focus-visible': {
          outline: '2px solid #147dc5',
          outlineOffset: '2px',
        },
      }}
    >
      {isActive && (
        <motion.div
          layoutId="active-tab-bg"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 6,
            backgroundColor: highlightBg,
            zIndex: 0,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        />
      )}
      <Typography
        variant="body2"
        sx={{
          position: 'relative',
          zIndex: 1,
          fontWeight: highlighted ? 600 : 500,
          fontSize: '0.875rem',
          color: highlighted ? textActive : textInactive,
          whiteSpace: 'nowrap',
          transition: 'color 0.18s ease',
          lineHeight: 1.4,
        }}
      >
        {tab.label}
      </Typography>
    </Box>
  );
}