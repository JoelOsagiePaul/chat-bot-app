import React, { memo, useMemo } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import type { Message } from '../../types/chatbot';
import { animations } from '../../utils/transitionUtils';
import { parseMessage, renderMessageElement } from '../../utils/messageFormatter';

interface ChatMessageProps {
  message: Message;
}

/**
 * Optimized ChatMessage component with rich text formatting support
 * Supports: headings, lists, code blocks, bold, italic, inline code, and links
 */
export const ChatMessage: React.FC<ChatMessageProps> = memo(({ message }) => {
  const isUser = message.sender === 'user';

  /**
   * Parse and render formatted message content (memoized for performance)
   */
  const renderedContent = useMemo(() => {
    const elements = parseMessage(message.text);
    return elements.map((element, index) => renderMessageElement(element, index, isUser));
  }, [message.text, isUser]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        ...animations.fadeIn,
      }}
    >
      <Paper
        elevation={isUser ? 2 : 1}
        sx={{
          px: 2.5,
          py: 2,
          maxWidth: '80%',
          backgroundColor: isUser 
            ? 'secondary.main' 
            : 'background.paper',
          color: isUser ? 'secondary.contrastText' : 'text.primary',
          borderRadius: 2.5,
          borderTopRightRadius: isUser ? 0 : 2.5,
          borderTopLeftRadius: isUser ? 2.5 : 0,
          border: isUser ? 'none' : '1px solid rgba(139, 92, 246, 0.15)',
          boxShadow: isUser 
            ? '0 2px 8px rgba(139, 92, 246, 0.3)' 
            : '0 2px 8px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: isUser 
              ? '0 4px 12px rgba(139, 92, 246, 0.4)' 
              : '0 4px 12px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <Box
          sx={{ 
            wordBreak: 'break-word',
            lineHeight: 1.6,
            '& i[id]': {
              fontStyle: 'normal',
              marginRight: '4px',
            },
            '& > *:first-of-type': {
              mt: 0,
            },
            '& > *:last-child': {
              mb: 0,
            },
          }}
        >
          {renderedContent}
        </Box>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1.5,
            opacity: 0.6,
            fontSize: '0.7rem',
            textAlign: 'right',
            fontStyle: 'italic',
          }}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
      </Paper>
    </Box>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
