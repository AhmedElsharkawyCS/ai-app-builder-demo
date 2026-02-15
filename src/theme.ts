import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#6D4BCB', light: '#8B6FD9', dark: '#5535A8' },
    secondary: { main: '#147DC5', light: '#3A95D4', dark: '#0E5F96' },
    success: { main: '#2ACE00' },
    warning: { main: '#F4BE4F' },
    error: { main: '#FF0000' },
    background: { default: '#FFFFFF', paper: '#F9F9F9' },
    text: { primary: '#20232B', secondary: '#9F9F9F' },
    divider: '#F2F2F2',
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' as const },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 28px',
          fontSize: '0.95rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
  },
});

export default theme;
