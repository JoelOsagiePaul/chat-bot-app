import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#000000',
      light: '#1a1a1a',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#8B5CF6',
      light: '#A78BFA',
      dark: '#7C3AED',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h6: {
      fontWeight: 600,
      color: '#FFFFFF',
    },
    body1: {
      fontSize: '0.95rem',
      color: '#FFFFFF',
    },
    body2: {
      fontSize: '0.875rem',
      color: 'rgba(255, 255, 255, 0.7)',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '12px',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(139, 92, 246, 0.6)',
            background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1a1a1a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        elevation4: {
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(139, 92, 246, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8B5CF6',
            },
          },
        },
      },
    },
  },
});

export default theme;
