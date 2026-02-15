import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { STEPS } from '../types';
import StepIndicator from './StepIndicator';

interface WizardHeaderProps {
  activeStep: number;
}

export default function WizardHeader({ activeStep }: WizardHeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          textAlign: 'center',
          mb: 4,
          pt: 2,
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6D4BCB, #147DC5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(109, 75, 203, 0.3)',
            }}
          >
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>M</Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Merchant Onboarding
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 480, mx: 'auto' }}>
          Complete the verification process to start accepting payments. It only takes a few minutes.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? 0.5 : 1,
          flexWrap: 'wrap',
        }}
      >
        {STEPS.map((label, index) => (
          <StepIndicator
            key={label}
            label={label}
            index={index}
            activeStep={activeStep}
            isLast={index === STEPS.length - 1}
            isMobile={isMobile}
          />
        ))}
      </Box>
    </Box>
  );
}
