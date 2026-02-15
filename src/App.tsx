import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { FormProvider } from './context/FormContext';
import OnboardingWizard from './components/OnboardingWizard';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FormProvider>
        <OnboardingWizard />
      </FormProvider>
    </ThemeProvider>
  );
}
