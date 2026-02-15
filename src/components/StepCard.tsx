import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface StepCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function StepCard({ icon, title, subtitle, children }: StepCardProps) {
  return (
    <Box
      sx={{
        background: '#fff',
        borderRadius: '20px',
        border: '1px solid #F2F2F2',
        boxShadow: '0 4px 32px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderBottom: '1px solid #F2F2F2',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(109,75,203,0.1), rgba(20,125,197,0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>{children}</Box>
    </Box>
  );
}
