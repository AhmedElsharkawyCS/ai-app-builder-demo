import { useState } from 'react';
import { Box } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { STEPS } from '../types';
import WizardHeader from './WizardHeader';
import StepRenderer from './StepRenderer';
import WizardNavigation from './WizardNavigation';
import SuccessScreen from './SuccessScreen';

export default function OnboardingWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    if (activeStep === STEPS.length - 1) {
      setSubmitted(true);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  if (submitted) {
    return <SuccessScreen />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f0ff 0%, #e8f4fd 50%, #f9f9f9 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: { xs: 2, md: 4 },
        px: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 860 }}>
        <WizardHeader activeStep={activeStep} />
        <AnimatePresence mode="wait">
          <StepRenderer key={activeStep} activeStep={activeStep} />
        </AnimatePresence>
        <WizardNavigation
          activeStep={activeStep}
          onNext={handleNext}
          onBack={handleBack}
        />
      </Box>
    </Box>
  );
}
