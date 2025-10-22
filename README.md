# NoireIQ ChatBot - React + Vite + Material UI

A beautiful, reusable chatbot interface built with React, Vite, and Material UI, integrated with the NoireIQ backend API.

## 🎨 Features

- **Beautiful UI**: Purple, white, and black theme matching the NoireIQ brand
- **Material UI**: Modern, responsive design with Material UI components
- **API Integration**: Full integration with NoireIQ backend for real conversations
- **Authentication**: Secure JWT-based login with 5-minute session expiry
- **Clickable Links**: URLs in messages are automatically converted to clickable links
- **Web Component**: Reusable `<noireiq-chatbot>` custom element
- **Floating Action Button**: Easy access via FAB in the bottom-right corner
- **Conversation History**: Loads and displays previous conversations
- **Real-time Chat**: Send messages and receive AI-powered responses
- **Session Management**: Automatic logout after 5 minutes for security
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- NoireIQ backend running (default: http://localhost:4000)

### Installation

\`\`\`bash
# Install dependencies
pnpm install

# Create environment file
cp .env.example .env

# Update the API URL in .env if needed
# VITE_API_BASE_URL=http://localhost:4000/api/
\`\`\`

### Running the Development Server

\`\`\`bash
# Start the dev server
pnpm dev

# The app will be available at http://localhost:5173
\`\`\`

### Building for Production

\`\`\`bash
# Build the application
pnpm build

# Preview the production build
pnpm preview
\`\`\`

## 🔧 Configuration

### Environment Variables

Create a \`.env\` file in the root directory:

\`\`\`env
VITE_API_BASE_URL=http://localhost:4000/api/
\`\`\`

### API Endpoints

The chatbot uses the following NoireIQ API endpoints:

- \`POST /api/assistant/chat\` - Send chat messages
- \`GET /api/assistant/conversation\` - Fetch conversation history

## 💬 Using the ChatBot

### As a React Component

\`\`\`tsx
import { ChatBotFAB } from './components';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <ChatBotFAB />
    </div>
  );
}
\`\`\`

### As a Web Component

\`\`\`html
<!-- Simple usage -->
<noireiq-chatbot></noireiq-chatbot>

<!-- With custom attributes -->
<noireiq-chatbot 
  title="Custom Assistant"
  placeholder="Ask me anything...">
</noireiq-chatbot>
\`\`\`

## 🎯 Authentication

The chatbot includes secure authentication with automatic session management:

### Login Process
1. Click the "Login" button in the chat interface
2. Enter your email and password
3. Upon successful login, you'll have access to all chatbot features

### Session Management
- **Duration**: Sessions last for 5 minutes after login
- **Auto-logout**: Users are automatically logged out when the session expires
- **Security**: JWT tokens are stored securely in localStorage
- **Token Validation**: Tokens are checked before each API request

For more details, see [FEATURES.md](./FEATURES.md)

### Manual Token Storage

You can also manually store auth tokens (for development/testing):

```javascript
// This will set a token with 5-minute expiry
import { setAuthToken } from './utils/auth';
setAuthToken('your-jwt-token');
```

## 📖 Documentation

- **[TESTING.md](./TESTING.md)** - Comprehensive testing guide for all endpoints
- **[FEATURES.md](./FEATURES.md)** - Detailed feature documentation (clickable links, session expiry)

## 📁 Project Structure

```
chat-bot-app/
├── src/
│   ├── components/
│   │   ├── ChatBot/           # Main chatbot component
│   │   ├── ChatMessage/        # Individual message component (with clickable links)
│   │   ├── ChatInput/          # Message input field
│   │   ├── ChatLogin/          # Login form component
│   │   ├── ChatBotFAB/         # Floating action button
│   │   └── WebComponent/       # Web component wrapper
│   ├── services/
│   │   └── chatbot.service.ts  # API service layer
│   ├── theme/
│   │   └── index.ts            # Material UI theme
│   ├── types/
│   │   └── chatbot.ts          # TypeScript interfaces
│   ├── utils/
│   │   ├── api.ts              # API configuration
│   │   └── auth.ts             # Authentication utilities
│   ├── App.tsx                 # Main application
│   └── main.tsx                # Entry point
├── .env.example                # Environment variables template
├── FEATURES.md                 # Feature documentation
├── TESTING.md                  # Testing guide
├── package.json
└── vite.config.ts
```

## 🎨 Customization

### Theme Colors

Edit \`src/theme/index.ts\` to customize the color scheme:

\`\`\`typescript
export const theme = createTheme({
  palette: {
    primary: { main: '#000000' },      // Black
    secondary: { main: '#8B5CF6' },    // Purple
    // ... customize other colors
  },
});
\`\`\`

### Chatbot Behavior

Modify \`src/components/ChatBot/ChatBot.tsx\` to customize:
- Welcome message
- Error handling
- Message display format
- Loading states

## 🔌 API Integration

The chatbot communicates with the NoireIQ backend using the service layer in \`src/services/chatbot.service.ts\`:

\`\`\`typescript
// Send a message
await chatBotService.sendMessage({
  message: "What events are happening this weekend?",
  location: { latitude: 6.5244, longitude: 3.3792 }
});

// Fetch conversation history
await chatBotService.fetchConversationHistory(page, pageSize);
\`\`\`

## 🐛 Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure the NoireIQ backend has the chatbot URL in its allowed origins.

### Authentication Errors

If you see "Unauthorized" messages:
1. Check that the NoireIQ backend is running
2. Verify the JWT token is valid and not expired
3. Ensure the token is stored in localStorage/sessionStorage

### API Connection Issues

If the chatbot can't connect to the API:
1. Verify the \`VITE_API_BASE_URL\` in \`.env\`
2. Check that the NoireIQ backend is running
3. Test the API endpoints directly using curl or Postman

## 📝 License

This project is part of the NoireIQ platform.

## 🤝 Contributing

This is a private project. For questions or contributions, contact the development team.
