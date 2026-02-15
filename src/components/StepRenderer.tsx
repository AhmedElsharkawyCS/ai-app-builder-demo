import { motion } from 'framer-motion';
import BusinessStep from './steps/BusinessStep';
import OwnerStep from './steps/OwnerStep';
import DocumentStep from './steps/DocumentStep';
import BankStep from './steps/BankStep';
import ReviewStep from './steps/ReviewStep';

const stepVariants = {
  initial: { opacity: 0, x: 40, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, x: -40, scale: 0.98, transition: { duration: 0.25 } },
};

const steps = [BusinessStep, OwnerStep, DocumentStep, BankStep, ReviewStep];

export default function StepRenderer({ activeStep }: { activeStep: number }) {
  const StepComponent = steps[activeStep];

  return (
    <motion.div variants={stepVariants} initial="initial" animate="animate" exit="exit">
      <StepComponent />
    </motion.div>
  );
}
