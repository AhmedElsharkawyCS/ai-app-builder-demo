import React from 'react';
import { Box } from '@mui/material';

interface FilterBarProps {
  children?: React.ReactNode;
}

export function FilterBar({ children }: FilterBarProps) {
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: 0,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        flexWrap: 'wrap',
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}
