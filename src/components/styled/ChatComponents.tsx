import { styled } from '@mui/material/styles';
import { Fab, Paper, Box } from '@mui/material';
import { transitionConfig } from '../../utils/transitionUtils';

/**
 * Styled FAB with gradient and consistent transitions
 */
export const StyledFab = styled(Fab)(() => ({
  position: 'fixed',
  zIndex: 1300,
  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  transition: `all ${transitionConfig.enter}ms ${transitionConfig.easing.easeInOut}`,
  
  '&:hover': {
    boxShadow: '0 6px 24px rgba(139, 92, 246, 0.6)',
    background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
    transform: 'scale(1.05)',
  },
  
  '&:active': {
    transform: 'scale(0.95)',
  },
}));

/**
 * Styled close FAB with consistent styling
 */
export const StyledCloseFab = styled(Fab)(() => ({
  position: 'fixed',
  zIndex: 1400,
  transition: `all ${transitionConfig.enter}ms ${transitionConfig.easing.easeInOut}`,
}));

/**
 * Chat window container with optimized positioning
 */
export const ChatWindowContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  zIndex: 1350,
  transition: `all ${transitionConfig.enter}ms ${transitionConfig.easing.easeInOut}`,
  
  [theme.breakpoints.down('sm')]: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
}));

/**
 * Chat window paper with consistent styling
 */
export const ChatWindowPaper = styled(Paper)(({ theme }) => ({
  width: 400,
  height: 600,
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
  borderRadius: theme.shape.borderRadius,
  
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '100%',
    maxHeight: '100vh',
    borderRadius: 0,
  },
}));

/**
 * Message area with optimized scrolling
 */
export const MessageArea = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(139, 92, 246, 0.3)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'rgba(139, 92, 246, 0.5)',
  },
}));
