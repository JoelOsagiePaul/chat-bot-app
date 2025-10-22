import React, { memo, useMemo } from 'react';
import { Box, Paper, Typography, Link } from '@mui/material';
import type { Message } from '../../types/chatbot';
import { animations } from '../../utils/transitionUtils';

interface ChatMessageProps {
  message: Message;
}

/**
 * Optimized ChatMessage component with memoization and clickable links
 */
export const ChatMessage: React.FC<ChatMessageProps> = memo(({ message }) => {
  const isUser = message.sender === 'user';

  /**
   * Convert URLs in text to clickable links (memoized for performance)
   */
  const renderMessageWithLinks = useMemo(() => {
    const text = message.text;
    // Regex to match URLs (http, https, and www)
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
    const parts = text.split(urlRegex).filter(Boolean);

    return parts.map((part, index) => {
      // Check if this part is a URL
      if (part.match(urlRegex)) {
        const url = part.startsWith('www.') ? `https://${part}` : part;
        return (
          <Link
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: isUser ? 'rgba(255, 255, 255, 0.9)' : 'secondary.main',
              textDecoration: 'underline',
              '&:hover': {
                color: isUser ? '#ffffff' : 'secondary.light',
              },
            }}
          >
            {part}
          </Link>
        );
      }
      return <span key={index}>{part}</span>;
    });
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
        elevation={1}
        sx={{
          px: 2,
          py: 1.5,
          maxWidth: '75%',
          backgroundColor: isUser ? 'secondary.main' : 'background.paper',
          color: isUser ? 'secondary.contrastText' : 'text.primary',
          borderRadius: 2,
          borderTopRightRadius: isUser ? 0 : 2,
          borderTopLeftRadius: isUser ? 2 : 0,
          border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography 
          variant="body1" 
          sx={{ 
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            '& i[id]': {
              fontStyle: 'normal',
              marginRight: '4px',
            },
          }}
        >
          {renderMessageWithLinks}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.5,
            opacity: 0.7,
            fontSize: '0.7rem',
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
