import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#f2f2f2',
    },
    primary: {
      main: '#147dc5',
      light: '#3da6e1',
    },
    text: {
      primary: '#20232b',
      secondary: '#6b7280',
      disabled: '#9e9e9e',
    },
    divider: '#e8e8e8',
    grey: {
      100: '#f2f2f2',
      200: '#e8e8e8',
      300: '#d0d0d0',
      400: '#9e9e9e',
      500: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    fontSize: 14,
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f2f2f2',
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(249, 249, 249, 0.8)',
          backdropFilter: 'blur(10px)',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
        },
      },
    },
    MuiTab: {
      defaultProps: { disableRipple: true, disableTouchRipple: true, focusRipple: false },
      styleOverrides: {
        root: {
          fontSize: '11px',
          fontWeight: 500,
          color: '#20232b',
          textTransform: 'none',
          borderRadius: '8px',
          minHeight: 36,
          padding: '0 8px',
          '&.Mui-selected': {
            backgroundColor: '#ffffff',
            color: '#20232b',
            fontWeight: 600,
            boxShadow: '0px 0px 14px rgba(0,0,0,0.04)',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: '1px solid #f2f2f2',
          borderRadius: '8px',
          fontSize: '0.6875rem',
          fontWeight: 600,
          textTransform: 'none',
          color: '#20232b',
          padding: '4px 12px',
          '&.Mui-selected': {
            background: 'linear-gradient(268.7deg, #147dc5 0%, #3da6e1 100%)',
            color: '#ffffff',
            border: 'none',
            '&:hover': {
              background: 'linear-gradient(268.7deg, #147dc5 0%, #3da6e1 100%)',
            },
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        grouped: {
          borderRadius: '8px !important',
          border: '1px solid #f2f2f2 !important',
          margin: 0,
        },
      },
    },
    MuiButtonBase: { defaultProps: { disableRipple: true, disableTouchRipple: true } },
    MuiIconButton: { defaultProps: { disableRipple: true, disableTouchRipple: true } },
    MuiButton: { defaultProps: { disableRipple: true, disableTouchRipple: true } },
    MuiChip: { defaultProps: { clickable: false } },
    MuiListItemButton: { defaultProps: { disableRipple: true, disableTouchRipple: true } },
    MuiMenuItem: { defaultProps: { disableRipple: true, disableTouchRipple: true } },
    MuiSwitch: { defaultProps: { disableRipple: true } },
    MuiCheckbox: { defaultProps: { disableRipple: true } },
    MuiRadio: { defaultProps: { disableRipple: true } },
    MuiFab: { defaultProps: { disableRipple: true, disableTouchRipple: true } },
  },
});

export default theme;