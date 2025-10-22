import React, { useState, useCallback, lazy, Suspense, memo } from 'react';
import { Zoom, Slide, Fade, CircularProgress, Box } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { useFabPosition, useChatWindowDimensions } from '../../hooks/useFabPosition';
import { StyledFab, StyledCloseFab, ChatWindowContainer } from '../styled/ChatComponents';
import { transitionPresets } from '../../utils/transitionUtils';

// Lazy load ChatBot component for better initial bundle size
const ChatBot = lazy(() => import('../ChatBot/ChatBot').then(module => ({ default: module.ChatBot })));


const ChatBotLoader = memo(() => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 400,
      height: 600,
      bgcolor: 'background.paper',
      borderRadius: 2,
    }}
  >
    <CircularProgress color="secondary" />
  </Box>
));

ChatBotLoader.displayName = 'ChatBotLoader';


export const ChatBotFAB: React.FC = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { fabRef, fabPosition, chatWindowPosition, FAB_SPACING } = useFabPosition();
  const { isMobile } = useChatWindowDimensions();

  const toggleChatBot = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <>
      {/* Chatbot Window with smart positioning */}
      <Slide
        direction="up"
        in={isOpen}
        timeout={transitionPresets.chatWindow}
        mountOnEnter
        unmountOnExit
      >
        <ChatWindowContainer
          sx={{
            bottom: isMobile ? 0 : chatWindowPosition.bottom,
            right: isMobile ? 0 : chatWindowPosition.right,
          }}
        >
          <Fade in={isOpen} timeout={transitionPresets.chatWindow.enter}>
            <div>
              <Suspense fallback={<ChatBotLoader />}>
                <ChatBot onClose={toggleChatBot} />
              </Suspense>
            </div>
          </Fade>
        </ChatWindowContainer>
      </Slide>

      {/* Floating Action Button */}
      <Zoom in={!isOpen} timeout={transitionPresets.fab}>
        <StyledFab
          ref={fabRef}
          color="primary"
          aria-label="open chat"
          onClick={toggleChatBot}
          sx={{
            bottom: fabPosition.bottom,
            right: fabPosition.right,
          }}
        >
          <ChatIcon />
        </StyledFab>
      </Zoom>

      {/* Close Button (when chat is open) */}
      <Zoom in={isOpen} timeout={transitionPresets.fab}>
        <StyledCloseFab
          color="secondary"
          aria-label="close chat"
          onClick={toggleChatBot}
          size="small"
          sx={{
            bottom: isMobile ? 'auto' : chatWindowPosition.bottom + 620,
            top: isMobile ? FAB_SPACING : 'auto',
            right: FAB_SPACING,
          }}
        >
          <CloseIcon />
        </StyledCloseFab>
      </Zoom>
    </>
  );
});

ChatBotFAB.displayName = 'ChatBotFAB';

export default ChatBotFAB;
