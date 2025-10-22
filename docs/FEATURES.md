# ChatBot Features

## 1. Clickable Links in Messages

### Overview
All URLs in chatbot messages are automatically converted to clickable links that open in a new tab.

### Supported URL Formats
- Full URLs: `https://example.com` or `http://example.com`
- WWW URLs: `www.example.com` (automatically prefixed with `https://`)

### Implementation
- Links are styled consistently with the theme (purple for bot messages, white for user messages)
- All links open in a new tab with `target="_blank"` and `rel="noopener noreferrer"` for security
- Hover effects provide visual feedback

### Example
When the bot responds with:
```
"Check out this event: https://noireiq.com/events/123"
```

The URL will be automatically clickable and styled appropriately.

---

## 2. 5-Minute Session Expiry

### Overview
User authentication sessions automatically expire after 5 minutes of login for security purposes.

### How It Works

#### Login Process
1. User enters email and password
2. Upon successful authentication, the system stores:
   - Auth token in `localStorage` as `noireiq_token`
   - Expiry timestamp as `noireiq_token_expiry` (current time + 5 minutes)

#### Session Monitoring
- The app checks token validity on:
  - Initial page load
  - Every minute via interval check
  - Before each API request

#### Expiry Behavior
When a session expires:
1. All auth tokens are cleared from storage
2. User is logged out automatically
3. Chat history is reset to welcome message
4. Error message displayed: "Your session has expired. Please log in again."
5. Login prompt appears in the chat interface

### Token Management Utilities

The app includes centralized auth utilities (`src/utils/auth.ts`):

```typescript
// Store token with 5-minute expiry
setAuthToken(token: string)

// Get token only if valid (not expired)
getAuthToken(): string | null

// Check if current token is expired
isTokenExpired(): boolean

// Clear all auth data
clearAuthToken(): void

// Get remaining session time in seconds
getRemainingSessionTime(): number

// Check if user has valid authentication
isAuthenticated(): boolean
```

### Security Considerations
- Tokens are checked before every API call
- Expired tokens are immediately cleared
- API 401 responses trigger automatic logout
- Session expiry is enforced both client-side and server-side

### User Experience
1. **Before Expiry**: User can chat normally
2. **After Expiry**: 
   - Automatic logout
   - Clear error message
   - Easy re-login with button click
   - Session state is preserved in chat history until logout

### Extending Session Duration

To change the session duration, modify the `SESSION_DURATION` constant in `src/utils/auth.ts`:

```typescript
// Current: 5 minutes
const SESSION_DURATION = 5 * 60 * 1000;

// Example: 15 minutes
const SESSION_DURATION = 15 * 60 * 1000;

// Example: 1 hour
const SESSION_DURATION = 60 * 60 * 1000;
```

### Testing Session Expiry

1. **Quick Test** (modify duration temporarily):
   ```typescript
   // In src/utils/auth.ts, change to 30 seconds for testing
   const SESSION_DURATION = 30 * 1000;
   ```

2. **Manual Test**:
   - Log in to the chatbot
   - Wait 5 minutes
   - Try to send a message
   - Observe automatic logout and error message

3. **Developer Tools Test**:
   - Open browser DevTools → Application → Local Storage
   - Find `noireiq_token_expiry`
   - Manually edit to a past timestamp
   - Refresh page or send message
   - Observe automatic logout

---

## Additional Notes

### Browser Compatibility
- Both features work in all modern browsers
- Session storage uses `localStorage` (95%+ browser support)
- Links use standard HTML anchor elements

### Performance
- Link detection uses regex pattern matching (minimal overhead)
- Token expiry checks run every 60 seconds (low resource usage)
- No external dependencies required for either feature

### Accessibility
- Links include proper ARIA attributes
- Link color contrast meets WCAG standards
- Session expiry messages are announced to screen readers
