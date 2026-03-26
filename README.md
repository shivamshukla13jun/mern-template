# MERN Template - Production Ready
## 🚀 How to Use This Template

1. Open this repository on GitHub
2. Click on **Use this template** (top-right)

![Use This Template](use-template.png)

3. Choose **Create a new repository**
4. Give your project a name
5. Click **Create repository**
A production-ready full-stack MERN (MongoDB, Express, React, Node.js) template with TypeScript, featuring clean architecture, Redis caching, role-based access control, and comprehensive documentation.

## 📚 Documentation

- **[Quick Start Guide](./QUICK_START.md)** - Get up and running in 5 minutes
- **[Architecture Documentation](./ARCHITECTURE.md)** - Detailed architecture and design patterns
- **[API Documentation](http://localhost:3000/api-docs)** - Interactive Swagger documentation (after starting the server)

## 🏗️ Architecture Overview

This project follows a **clean, modular architecture** with the following stack:

### Backend (Node.js + TypeScript + Express)
- **Auth Service**: JWT authentication, refresh tokens, password reset
- **User Service**: User management with RBAC
- **Permission Service**: Role-based access control
- **Session Management**: Redis-backed sessions
- **API Documentation**: Auto-generated Swagger docs


### Infrastructure
- **MongoDB**: Primary database with Mongoose ODM
- **Redis**: Session storage and caching
- **RabbitMQ**: Message queuing (optional, configured but not active)

## 🚀 Features

### Authentication & Authorization
- ✅ JWT authentication with refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ Password reset via email
### Backend Features
- ✅ Clean modular architecture
- ✅ Auto-generated Swagger documentation
- ✅ Input validation with Zod
- ✅ Centralized error handling
- ✅ File upload support
- ✅ Email service (Nodemailer)
- ✅ Logging with Winston
- ✅ Security (Helmet, CORS, Rate limiting)
- ✅ TypeScript for type safety

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher)
- **Redis** (v7 or higher)
- **npm** or **yarn**

**Note**: RabbitMQ is configured but optional. The application works without it.

## 🛠️ Quick Installation

> **For detailed setup instructions, see [QUICK_START.md](./QUICK_START.md)**

### 1. Install Dependencies

```bash


### 1. Configure Environment

```bash
# Backend
npm i
cp .env.example .env
# Edit .env with your configuration

```

### 2. Start Services

```bash
# Start MongoDB (using Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Start Redis (using Docker)
docker run -d -p 6379:6379 --name redis redis:latest
```

### 3. Run Applications

```bash
# Backend (Terminal 1)
npm run dev

```

### 4. Access the Application

- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs

### Default Login Credentials

- **Super Admin**: `superadmin@example.com` / `SuperAdmin@123`
- **Admin**: `admin@example.com` / `Admin@123`
- **User**: `user@example.com` / `User@123`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)


**Full interactive documentation**: http://localhost:3000/api-docs

## 🗄️ Database Schema

### User Collection
```typescript
{
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
  isBlocked: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/your_db` |
| `JWT_SECRET` | JWT secret key | - |
| `REFRESH_TOKEN_SECRET` | Refresh token secret | - |
| `REDIS_HOST` | Redis host | `127.0.0.1` |
| `REDIS_PORT` | Redis port | `6379` |


**See `.env.example` files for complete configuration options.**

## 🔒 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Redis session management
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Rate limiting
- ✅ Input validation
- ✅ XSS protection
- ✅ Encrypted state storage (frontend)


