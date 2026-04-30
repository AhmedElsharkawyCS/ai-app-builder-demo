import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Collapse, IconButton, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface CategorySectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  storageKey?: string;
}

export function CategorySection({
  title,
  description,
  icon,
  accentColor,
  defaultExpanded = false,
  children,
  storageKey,
}: CategorySectionProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Load expanded state from localStorage
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(`category-${storageKey}-expanded`);
      if (saved !== null) {
        setExpanded(saved === 'true');
      }
    }
  }, [storageKey]);

  // Save expanded state to localStorage
  const handleToggle = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (storageKey) {
      localStorage.setItem(`category-${storageKey}-expanded`, String(newExpanded));
    }
  };

  // Handle keyboard events
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Category Header */}
      <Box
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-label={`${title} category`}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          py: 1.75,
          px: 2.5,
          cursor: 'pointer',
          borderBottom: expanded ? `1px solid ${theme.palette.divider}` : 'none',
          backgroundColor: expanded ? `${accentColor}06` : 'transparent',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: `${accentColor}08`,
          },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: -2,
          },
        }}
      >
        {/* Dot Indicator */}
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: accentColor,
            flexShrink: 0,
          }}
        />

        {/* Icon */}
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            backgroundColor: `${accentColor}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        {/* Title and Description */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 0.25,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 400,
              color: theme.palette.text.secondary,
              lineHeight: 1.4,
            }}
          >
            {description}
          </Typography>
        </Box>

        {/* Expand/Collapse Icon */}
        <IconButton
          size="small"
          sx={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease-in-out',
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: 'transparent',
              color: accentColor,
            },
          }}
          aria-label={expanded ? 'Collapse section' : 'Expand section'}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>

      {/* Collapsible Content */}
      <Collapse in={expanded} timeout={300}>
        <Box sx={{ px: 2.5, pb: 2.5, pt: 1.5 }}>{children}</Box>
      </Collapse>
    </Paper>
  );
}
