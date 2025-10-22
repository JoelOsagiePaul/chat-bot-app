import React, { useState, useCallback, memo } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Optimized ChatInput component with memoization
 */
export const ChatInput: React.FC<ChatInputProps> = memo(({
  onSendMessage,
  placeholder = 'Type a message...',
  disabled = false,
}) => {
  const [message, setMessage] = useState('');

  const handleSend = useCallback(() => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  }, [message, onSendMessage]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, []);

  const handleKeyPress = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        p: 2,
        borderTop: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'background.paper',
      }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder={placeholder}
        value={message}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        variant="outlined"
        multiline
        maxRows={3}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(139, 92, 246, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'secondary.main',
            },
          },
          '& .MuiInputBase-input': {
            color: 'text.primary',
          },
        }}
      />
      <IconButton
        color="secondary"
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        sx={{
          alignSelf: 'flex-end',
          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
          },
          '&.Mui-disabled': {
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;
