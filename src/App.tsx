import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box, Card, CardContent, Stack } from '@mui/material';
import { theme } from './theme';
import { ChatBotFAB } from './components';
import './App.css';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            NoireIQ ChatBot Demo
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            A Reusable Web Component Built with React + Vite + Material UI
          </Typography>
        </Box>

        <Stack spacing={4}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            <Box sx={{ flex: 1 }}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    🚀 Features
                  </Typography>
                  <Typography variant="body1" paragraph>
                    • Material UI for beautiful, responsive design
                  </Typography>
                  <Typography variant="body1" paragraph>
                    • Floating Action Button (FAB) for easy access
                  </Typography>
                  <Typography variant="body1" paragraph>
                    • Smooth animations and transitions
                  </Typography>
                  <Typography variant="body1" paragraph>
                    • Reusable Web Component architecture
                  </Typography>
                  <Typography variant="body1">
                    • Mobile-responsive interface
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    💡 How to Use
                  </Typography>
                  <Typography variant="body1" paragraph>
                    1. Click the chat icon in the bottom-right corner
                  </Typography>
                  <Typography variant="body1" paragraph>
                    2. Type your message in the input field
                  </Typography>
                  <Typography variant="body1" paragraph>
                    3. Press Enter or click the send button
                  </Typography>
                  <Typography variant="body1">
                    4. Get instant responses from the AI assistant
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Stack>

          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                🔧 Web Component Integration
              </Typography>
              <Typography variant="body1" paragraph>
                This chatbot is built as a Web Component, making it easy to embed anywhere:
              </Typography>
              <Box
                component="pre"
                sx={{
                  bgcolor: 'black.100',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: '0.9rem',
                }}
              >
                {`<!-- Simple usage -->
<noireiq-chatbot></noireiq-chatbot>

<!-- With custom attributes -->
<noireiq-chatbot 
  title="Custom Assistant"
  placeholder="Ask me anything...">
</noireiq-chatbot>`}
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Container>

      {/* ChatBot FAB - Always visible */}
      <ChatBotFAB />
    </ThemeProvider>
  );
}

export default App;
