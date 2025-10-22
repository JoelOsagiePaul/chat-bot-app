# NoireIQ ChatBot - Testing Guide

## Overview
This guide walks you through testing the NoireIQ chatbot integration with the backend API.

## Prerequisites

1. **NoireIQ Backend Running**
   - Start the backend server on `http://localhost:4000`
   - Ensure database is connected and migrated

2. **Chat-Bot-App Setup**
   - Environment variables configured in `.env`
   - Dependencies installed (`pnpm install`)

## API Endpoints Used

### 1. POST /api/assistant/chat
**Purpose:** Send a chat message and receive AI response

**Request:**
```json
{
  "message": "Hello, I'm looking for events in Los Angeles",
  "location": {
    "latitude": 34.0522,
    "longitude": -118.2437
  },
  "llm": "openai"  // optional
}
```

**Response:**
```json
{
  "response": "Hello! I'd be happy to help you find events in Los Angeles. What type of events are you interested in?",
  "intent": {
    "type": "event_search",
    "value": "search_events"
  },
  "contextData": {
    "lastRecommendations": [],
    "referencedEventId": null
  }
}
```

### 2. GET /api/assistant/conversation
**Purpose:** Fetch conversation history

**Request:**
```
GET /api/assistant/conversation?page=1&pageSize=20
Headers:
  Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "data": [
    {
      "id": 123,
      "query": "Show me concerts in LA",
      "response": "Here are some upcoming concerts...",
      "createdAt": "2025-10-22T10:30:00Z",
      "intent": "event_search",
      "contextData": {
        "lastRecommendations": [...]
      }
    }
  ],
  "meta": {
    "totalItems": 50,
    "currentPage": 1,
    "pageSize": 20,
    "totalPages": 3,
    "hasMore": true
  }
}
```

## Testing Steps

### Step 1: Start Backend Server

```bash
cd /home/jay/Eventnoire/noireiq
pnpm install
pnpm dev
```

**Verify:** Server should be running on `http://localhost:4000`

### Step 2: Start ChatBot App

```bash
cd /home/jay/Eventnoire/chat-bot-app
pnpm install
pnpm dev
```

**Verify:** App should be running on `http://localhost:5173`

### Step 3: Test Without Authentication (Guest Mode)

1. **Open Browser:** Navigate to `http://localhost:5173`
2. **Click FAB:** Click the purple floating action button
3. **Send Message:** Type "Hello" and press Enter

**Expected Behavior:**
- If no token: Chatbot should show a message about needing to log in
- Message should still be sent to API
- API may return limited functionality response

### Step 4: Test With Authentication

1. **Get JWT Token:**
   - Log in to NoireIQ (use Postman or the main app)
   - Copy the JWT token

2. **Store Token:**
   Open browser console and run:
   ```javascript
   localStorage.setItem('noireiq_token', 'YOUR_JWT_TOKEN_HERE');
   ```

3. **Refresh Page:** Reload the chatbot app

4. **Test Conversation History:**
   - Chatbot should automatically load previous conversations
   - Check browser Network tab to see the GET request

5. **Send New Messages:**
   - Type various queries and observe responses
   - Check Network tab for POST requests

### Step 5: Test Conversation Flow

Try these test scenarios:

#### Test 1: Initial Greeting
```
User: Hello
Expected: Welcome message from bot
```

#### Test 2: Event Search
```
User: Find events in Los Angeles
Expected: Bot asks for more details or shows events
```

#### Test 3: Specific Event Type
```
User: Show me music concerts this weekend
Expected: Bot provides music event recommendations
```

#### Test 4: Event Details
```
User: Tell me more about the first event
Expected: Bot shows detailed information
```

#### Test 5: Location-Based Search
```
User: What's happening near me?
Expected: Bot uses location data (if provided)
```

## Using Browser DevTools

### Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Send messages and observe:

**For POST /api/assistant/chat:**
- Request Payload
- Response Data
- Status Code (should be 200)
- Response Time

**For GET /api/assistant/conversation:**
- Query Parameters (page, pageSize)
- Response Data
- Pagination Meta

### Console Tab
Check for:
- API configuration logs
- Error messages
- Network errors
- Token validation issues

## Testing with cURL

### Send Chat Message
```bash
curl -X POST http://localhost:4000/api/assistant/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "Hello, show me events in New York"
  }'
```

### Get Conversation History
```bash
curl -X GET "http://localhost:4000/api/assistant/conversation?page=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing with Postman

### Collection Setup

**Request 1: Send Chat Message**
```
POST {{baseUrl}}/api/assistant/chat
Headers:
  Content-Type: application/json
  Authorization: Bearer {{token}}

Body (JSON):
{
  "message": "Find events in Los Angeles",
  "location": {
    "latitude": 34.0522,
    "longitude": -118.2437
  }
}
```

**Request 2: Get Conversation History**
```
GET {{baseUrl}}/api/assistant/conversation?page=1&pageSize=20
Headers:
  Authorization: Bearer {{token}}
```

### Variables
```
baseUrl: http://localhost:4000
token: <your-jwt-token>
```

## Common Issues & Solutions

### Issue 1: CORS Error
**Symptom:** Request blocked by CORS policy

**Solution:**
- Ensure NoireIQ backend has CORS enabled
- Check that `http://localhost:5173` is in allowed origins

### Issue 2: 401 Unauthorized
**Symptom:** "Unauthorized - Please log in" message

**Solution:**
- Verify JWT token is valid
- Check token is stored in localStorage/sessionStorage
- Ensure token hasn't expired

### Issue 3: Network Error
**Symptom:** "Failed to send message" error

**Solution:**
- Verify backend is running on port 4000
- Check `.env` file has correct `VITE_API_BASE_URL`
- Test backend endpoint directly with cURL

### Issue 4: Empty Conversation History
**Symptom:** No messages loaded on startup

**Solutions:**
- Check if user has previous conversations in database
- Verify authentication token is valid
- Check Network tab for API response

### Issue 5: Message Not Rendering
**Symptom:** Message sent but not displayed

**Solution:**
- Check browser console for errors
- Verify response structure matches `ChatResponse` interface
- Check if HTML content is being sanitized

## Expected API Flow

```
1. User opens chatbot
   └─> GET /api/assistant/conversation (if authenticated)
       └─> Display conversation history

2. User sends message "Hello"
   └─> POST /api/assistant/chat
       Request: { message: "Hello" }
       Response: { response: "Hi! How can I help?" }
       └─> Display bot response

3. User continues conversation
   └─> POST /api/assistant/chat
       Request: { message: "Find events" }
       Response: { response: "Here are events...", intent: {...} }
       └─> Display bot response with recommendations
```

## Performance Testing

### Response Times
Monitor in Network tab:
- Chat message: Should be < 5 seconds
- Conversation history: Should be < 1 second

### Concurrent Messages
- Send multiple messages rapidly
- Verify all messages are processed
- Check for race conditions

## Debugging Checklist

- [ ] Backend server is running
- [ ] Frontend app is running
- [ ] Environment variables are set correctly
- [ ] JWT token is valid (if using auth)
- [ ] CORS is configured properly
- [ ] Database is accessible
- [ ] Network tab shows successful API calls
- [ ] Console has no errors
- [ ] Messages are displaying correctly
- [ ] Conversation history loads

## Next Steps

After basic testing:
1. Test with real user accounts
2. Test event search functionality
3. Test location-based recommendations
4. Test error handling
5. Test edge cases (empty messages, special characters, etc.)
6. Performance testing with many messages
7. Mobile responsiveness testing

## Support

For issues or questions:
- Check browser console for errors
- Review Network tab for API responses
- Verify backend logs
- Contact the development team
