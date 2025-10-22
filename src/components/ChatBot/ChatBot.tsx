import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { Box, Paper, Typography, IconButton, Divider, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LoginIcon from '@mui/icons-material/Login';
import type { Message, ChatBotProps } from '../../types/chatbot';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { ChatInput } from '../ChatInput/ChatInput';
import { ChatLogin } from '../ChatLogin/ChatLogin';
import { chatBotService } from '../../services/chatbot.service';
import { isTokenExpired, clearAuthToken, getAuthToken } from '../../utils/auth';


export const ChatBot: React.FC<ChatBotProps> = memo(({
  onClose,
  title = 'NoireIQ Assistant',
  placeholder = 'Type your message...',
  initialMessages = [],
}) => {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length > 0
      ? initialMessages
      : [
          {
            id: '1',
            text: 'Hello! I\'m your NoireIQ assistant. How can I help you discover events today?',
            sender: 'bot',
            timestamp: new Date(),
          },
        ]
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  
  const clearAuth = useCallback(() => {
    clearAuthToken();
    setIsAuthenticated(false);
    setShowLogin(false);
    // Reset to welcome message
    setMessages([
      {
        id: '1',
        text: 'Hello! I\'m your NoireIQ assistant. How can I help you discover events today?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Check authentication on mount and set up expiry check
  useEffect(() => {
    const token = getAuthToken();
    
    if (token) {
      setIsAuthenticated(true);
    } else {
      const hadToken = localStorage.getItem('noireiq_token');
      if (hadToken) {
        // Token existed but was expired
        setError('Your session has expired. Please log in again.');
      }
    }

    // Set up interval to check token expiry every minute
    const expiryCheckInterval = setInterval(() => {
      if (isAuthenticated && isTokenExpired()) {
        clearAuth();
        setError('Your session has expired. Please log in again.');
      }
    }, 60000); // Check every minute

    return () => clearInterval(expiryCheckInterval);
  }, []);
  
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isAuthenticated) {
      loadConversationHistory();
    }
  }, [isAuthenticated]);

  const loadConversationHistory = useCallback(async () => {
    if (initialMessages.length > 0) return; 
    setIsLoadingHistory(true);
    setError(null);

    try {
      const response = await chatBotService.fetchConversationHistory(1, 10);
      const historyMessages = chatBotService.convertAPIMessagesToChat(response.data);

      if (historyMessages.length > 0) {
        setMessages(historyMessages);
      }
    } catch (err) {
      console.error('Failed to load conversation history:', err);
      setError('Could not load conversation history');
    } finally {
      setIsLoadingHistory(false);
    }
  }, [initialMessages.length]);

  const handleLoginSuccess = useCallback((token: string) => {
    chatBotService.setToken(token);
    setIsAuthenticated(true);
    setShowLogin(false);
    setError(null); // Clear any previous error messages
    loadConversationHistory();
  }, [loadConversationHistory]);

  const getLocationIfAvailable = useCallback(() => {
    if (typeof window !== 'undefined') {
      const savedLocation = localStorage.getItem('noireiq_location');
      if (savedLocation) {
        try {
          return JSON.parse(savedLocation);
        } catch {
          return undefined;
        }
      }
    }
    return undefined;
  }, []);
  
  const sendMessageToAPI = useCallback(async (userMessage: string) => {
    setIsTyping(true);
    setError(null);

    try {
      const response = await chatBotService.sendMessage({
        message: userMessage,
        location: getLocationIfAvailable(),
      });

      const botResponse: Message = {
        id: Date.now().toString(),
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (err: unknown) {
      console.error('Error sending message:', err);
      
      // Check if error is due to authentication
      if (err instanceof Error && (err.message.includes('Unauthorized') || err.message.includes('401'))) {
        // Token might be expired or invalid
        if (isTokenExpired()) {
          clearAuth();
          setError('Your session has expired. Please log in again.');
        } else {
          setError('Authentication failed. Please log in again.');
          clearAuth();
        }
        return;
      }
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsTyping(false);
    }
  }, [clearAuth, getLocationIfAvailable]);

  const handleSendMessage = useCallback((text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    sendMessageToAPI(text);
  }, [sendMessageToAPI]);

  // Memoized placeholder text
  const inputPlaceholder = useMemo(() => 
    isAuthenticated ? placeholder : 'Please log in to chat...',
    [isAuthenticated, placeholder]
  );

  return (
    <Paper
      elevation={4}
      sx={{
        width: { xs: '100vw', sm: 400 },
        height: { xs: '100vh', sm: 600 },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'fixed',
        bottom: { xs: 0, sm: 20 },
        right: { xs: 0, sm: 20 },
        borderRadius: { xs: 0, sm: 2 },
        zIndex: 1300,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 2,
          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
          color: 'secondary.contrastText',
        }}
      >
        <SmartToyIcon />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {onClose && (
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: 'secondary.contrastText' }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Show Login Form if not authenticated and login is toggled */}
      {!isAuthenticated && showLogin ? (
        <Box sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: 'background.default' }}>
          <ChatLogin onLoginSuccess={handleLoginSuccess} />
        </Box>
      ) : (
        <>
          {/* Messages Area */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: 'background.default',
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
            }}
          >
            {isLoadingHistory && (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Loading conversation history...
                </Typography>
              </Box>
            )}

            {/* Show login prompt if not authenticated */}
            {!isAuthenticated && (
              <Box sx={{ textAlign: 'center', py: 3, px: 2 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Please log in to use all chatbot features
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<LoginIcon />}
                  onClick={() => setShowLogin(true)}
                  sx={{ borderRadius: 2 }}
                >
                  Login
                </Button>
              </Box>
            )}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                <Paper
                  elevation={1}
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    borderTopLeftRadius: 0,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {[0, 1, 2].map((i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'secondary.main',
                          animation: 'typing 1.4s infinite',
                          animationDelay: `${i * 0.2}s`,
                          '@keyframes typing': {
                            '0%, 60%, 100%': {
                              opacity: 0.3,
                              transform: 'translateY(0)',
                            },
                            '30%': {
                              opacity: 1,
                              transform: 'translateY(-10px)',
                            },
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Box>
            )}

            {error && (
              <Box sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="caption" color="error">
                  {error}
                </Typography>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <ChatInput
            onSendMessage={handleSendMessage}
            placeholder={inputPlaceholder}
            disabled={isTyping || !isAuthenticated}
          />
        </>
      )}
    </Paper>
  );
});

ChatBot.displayName = 'ChatBot';

export default ChatBot;
