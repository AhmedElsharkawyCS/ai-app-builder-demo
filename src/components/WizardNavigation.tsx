import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { STEPS } from '../types';

interface WizardNavigationProps {
  activeStep: number;
  onNext: () => void;
  onBack: () => void;
}

export default function WizardNavigation({ activeStep, onNext, onBack }: WizardNavigationProps) {
  const isLastStep = activeStep === STEPS.length - 1;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mt: 3,
        gap: 2,
      }}
    >
      <Button
        variant="outlined"
        onClick={onBack}
        disabled={activeStep === 0}
        startIcon={<ArrowBackIcon />}
        sx={{
          borderColor: '#F2F2F2',
          color: 'text.secondary',
          '&:hover': { borderColor: 'primary.main', color: 'primary.main', background: 'rgba(109,75,203,0.04)' },
        }}
      >
        Back
      </Button>
      <Button
        variant="contained"
        onClick={onNext}
        endIcon={isLastStep ? <RocketLaunchIcon /> : <ArrowForwardIcon />}
        sx={{
          background: isLastStep
            ? 'linear-gradient(135deg, #2ACE00, #20a800)'
            : 'linear-gradient(135deg, #6D4BCB, #147DC5)',
          boxShadow: isLastStep
            ? '0 4px 20px rgba(42,206,0,0.35)'
            : '0 4px 20px rgba(109,75,203,0.35)',
          '&:hover': {
            background: isLastStep
              ? 'linear-gradient(135deg, #24b800, #1c9400)'
              : 'linear-gradient(135deg, #5535A8, #0E5F96)',
            boxShadow: isLastStep
              ? '0 6px 28px rgba(42,206,0,0.45)'
              : '0 6px 28px rgba(109,75,203,0.45)',
          },
        }}
      >
        {isLastStep ? 'Submit Application' : 'Continue'}
      </Button>
    </Box>
  );
}
