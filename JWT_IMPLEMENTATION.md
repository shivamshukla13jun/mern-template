# JWT Token Authentication Implementation

## Overview
Successfully implemented JWT token-based authentication with token TTL (time-to-live) management in the database.

## Files Created/Modified

### 1. **New Token Model** - `src/models/token.model.ts`
- Created MongoDB schema for storing JWT tokens
- Implements TTL index to auto-delete expired tokens
- Tracks token type (access/refresh) and expiration
- Fields:
  - `userId`: Reference to user
  - `token`: The JWT token string
  - `type`: 'access' or 'refresh'
  - `expiresAt`: Expiration timestamp (with MongoDB TTL index)

### 2. **JWT Utilities** - `src/libs/jwt.ts`
Core JWT functions:
- `generateAccessToken()`: Create access tokens with configured expiry
- `generateRefreshToken()`: Create 7-day refresh tokens
- `saveTokenToDatabase()`: Store tokens in DB with TTL
- `verifyToken()`: Validate JWT signature
- `verifyTokenInDatabase()`: Check if token exists and is not revoked
- `revokeToken()`: Blacklist tokens on logout
- `getTokenExpirationSeconds()`: Parse expiration config

### 3. **Auth Controller** - `src/microservices/auth-service/auth.controller.ts`
Updated login and logout:
- **Login (`loginUser`)**: 
  - Validates credentials
  - Generates access + refresh tokens
  - Saves tokens to database
  - Returns tokens with expiration time
  
- **Logout (`logout`)**:
  - Extracts token from Authorization header
  - Revokes token by removing from database

### 4. **Middleware** - `src/middlewares/index.ts`
Replaced session-based auth with JWT:
- `verifyToken()`: 
  - Extracts Bearer token from Authorization header
  - Validates JWT signature
  - Checks token exists in database (not revoked)
  - Loads user and attaches to request
  - Handles JWT expiration and invalid token errors

## Environment Configuration
Ensure these variables are set in your `.env` file:

```env
JWT_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret
JWT_EXPIRE=1h
```

## Database Setup
The Token model includes:
- **TTL Index**: MongoDB automatically deletes tokens after `expiresAt`
- **Compound Index**: Efficient queries on userId + token type
- **Auto-cleanup**: No manual cleanup needed; MongoDB handles expiration

## API Usage

### Login
```bash
POST /api/auth/login
Body: { email, password }

Response:
{
  "success": true,
  "data": {
    "user": { _id, email, name, role, ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

### Protected Routes
```bash
GET /api/protected-endpoint
Authorization: Bearer <accessToken>
```

### Logout
```bash
POST /api/auth/logout
Authorization: Bearer <accessToken>
```

## Token Expiration
- **Access Token**: Configured via `JWT_EXPIRE` (default: 1 hour)
- **Refresh Token**: Fixed at 7 days
- **Database TTL**: Automatically removes expired records from MongoDB

## Dependencies Installed
```
jsonwebtoken@^10.x.x
@types/jsonwebtoken@^9.x.x
```

