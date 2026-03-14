import { createTheme } from '@mui/material/styles';

import type { ThemeMode } from './types/dashboard.types';

export function buildTheme(mode: ThemeMode) {
  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#147dc5',
        light: '#3da6e1',
      },
      secondary: {
        main: '#ceb9e8',
      },
      background: {
        default: isLight ? '#f0f2f5' : '#0d1117',
        paper: isLight ? '#ffffff' : '#161b22',
      },
      text: {
        primary: isLight ? '#1a1d23' : '#e6edf3',
        secondary: isLight ? '#656d76' : '#8b949e',
      },
      divider: isLight ? '#d8dee4' : '#30363d',
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      fontSize: 14,
      h6: { fontWeight: 600 },
      body2: { fontSize: '0.8125rem' },
    },
    shape: {
      borderRadius: 10,
    },
    shadows: [
      'none',
      isLight ? '0px 1px 3px rgba(0,0,0,0.06)' : '0px 1px 3px rgba(0,0,0,0.4)',
      isLight ? '0px 2px 6px rgba(0,0,0,0.06)' : '0px 2px 6px rgba(0,0,0,0.4)',
      isLight ? '0px 4px 12px rgba(0,0,0,0.08)' : '0px 4px 12px rgba(0,0,0,0.45)',
      ...Array(21).fill(isLight ? '0px 4px 16px rgba(0,0,0,0.08)' : '0px 4px 16px rgba(0,0,0,0.50)'),
    ] as any,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isLight ? '#f0f2f5' : '#0d1117',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 8,
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
          },
        },
      },
    },
  });
}

const theme = buildTheme('light');
export default theme;