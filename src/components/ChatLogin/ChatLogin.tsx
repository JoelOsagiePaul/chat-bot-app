import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { API_ENDPOINTS } from '../../utils/api';
import { setAuthToken } from '../../utils/auth';

interface ChatLoginProps {
  onLoginSuccess: (token: string) => void;
}

/**
 * ChatLogin Component
 * 
 * Simple login form for the chatbot to authenticate users
 */
export const ChatLogin: React.FC<ChatLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Invalid email or password');
      }

      const data = await response.json();
      
      // Store token with expiry using auth utility
      setAuthToken(data.token);
      
      // Call success callback
      onLoginSuccess(data.token);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 3,
        maxWidth: 400,
        mx: 'auto',
      }}
    >
      <Typography variant="h6" sx={{ textAlign: 'center', mb: 1 }}>
        Login to Chat
      </Typography>

      <Typography variant="body2" sx={{ textAlign: 'center', mb: 2, color: 'text.secondary' }}>
        Please log in to access the NoireIQ chatbot
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
        autoComplete="email"
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={loading}
        autoComplete="current-password"
      />

      <Button
        type="submit"
        variant="contained"
        color="secondary"
        fullWidth
        disabled={loading}
        sx={{ mt: 1 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Login'}
      </Button>

      <Typography variant="caption" sx={{ textAlign: 'center', color: 'text.secondary' }}>
        Don't have an account? Contact your administrator.
      </Typography>
    </Box>
  );
};

export default ChatLogin;
