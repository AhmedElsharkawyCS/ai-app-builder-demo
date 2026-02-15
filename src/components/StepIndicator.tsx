import { Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface StepIndicatorProps {
  label: string;
  index: number;
  activeStep: number;
  isLast: boolean;
  isMobile: boolean;
}

export default function StepIndicator({ label, index, activeStep, isLast, isMobile }: StepIndicatorProps) {
  const isCompleted = index < activeStep;
  const isActive = index === activeStep;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 0.5 : 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isCompleted
              ? 'linear-gradient(135deg, #2ACE00, #20a800)'
              : isActive
              ? 'linear-gradient(135deg, #6D4BCB, #147DC5)'
              : '#F2F2F2',
            color: isCompleted || isActive ? '#fff' : '#9F9F9F',
            fontWeight: 700,
            fontSize: '0.85rem',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isActive ? '0 4px 16px rgba(109, 75, 203, 0.35)' : 'none',
          }}
        >
          {isCompleted ? <CheckIcon sx={{ fontSize: 18 }} /> : index + 1}
        </Box>
        {!isMobile && (
          <Typography
            variant="caption"
            sx={{
              color: isActive ? 'primary.main' : isCompleted ? 'success.main' : 'text.secondary',
              fontWeight: isActive ? 600 : 400,
              fontSize: '0.7rem',
              whiteSpace: 'nowrap',
              transition: 'color 0.3s',
            }}
          >
            {label}
          </Typography>
        )}
      </Box>
      {!isLast && (
        <Box
          sx={{
            width: isMobile ? 20 : 48,
            height: 2,
            borderRadius: 1,
            background: isCompleted
              ? 'linear-gradient(90deg, #2ACE00, #6D4BCB)'
              : '#F2F2F2',
            transition: 'background 0.4s',
            mb: isMobile ? 0 : 2.5,
          }}
        />
      )}
    </Box>
  );
}
