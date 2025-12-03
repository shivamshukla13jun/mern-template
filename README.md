# MERN Template Microservices Platform

A full-stack application built with microservices architecture, featuring Redis caching, RabbitMQ message queuing, and a modern React frontend.

## 🏗️ Architecture Overview

This project follows a microservices architecture with the following components:

### Backend Services (Node.js + TypeScript)
- **Auth Service**: User authentication, authorization, sessions

### Frontend (React + TypeScript)
- **Users**:  User Management

### Infrastructure
- **Redis**: Caching, session storage, real-time data
- **RabbitMQ**: Message queuing, event-driven architecture
- **MongoDB**: Primary database for all services
- **Express.js**: RESTful API framework

## 🚀 Features

### Core Features
- ✅ User authentication and authorization
- ✅ Email notifications and alerts

### Technical Features
- ✅ Microservices architecture
- ✅ Redis caching for performance
- ✅ RabbitMQ message queuing
- ✅ Real-time inventory updates
- ✅ Event-driven architecture
- ✅ RESTful API design
- ✅ TypeScript for type safety
- ✅ Responsive React frontend
- ✅ Redux state management
- ✅ Material-UI components

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **MongoDB** (v5 or higher)
- **Redis** (v6 or higher)
- **RabbitMQ** (v3.8 or higher)
- **npm** or **yarn**

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd menrn-template
```

### 2. Backend Setup (ecom-api)

```bash
cd api
npm install
```

Create environment file:
```bash
cp env.example .env
```

Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/mern-template
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Frontend Setup (ecom-client)

```bash
cd client
npm install
```

### 4. Start Required Services

Start MongoDB:
```bash
mongod
```

Start Redis:
```bash
redis-server
```

Start RabbitMQ:
```bash
rabbitmq-server
```

### 5. Run the Application

Start the backend:
```bash
cd api
npm run dev
```

Start the frontend:
```bash
cd client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5070
- **API Documentation**: http://localhost:5070/api-docs

## 📚 API Documentation


## 🔄 Message Queue Events

The system uses RabbitMQ for event-driven communication:

## 🗄️ Database Schema

### User Collection
```typescript
{
  name: string;
  email: string;
  password: string;
  role: Role;  // Changed from Role[] to Role
  isActive: boolean;
  isBlocked: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  manager?: Types.ObjectId;
  ActivePlan?: Types.ObjectId; // Maximum allowed concurrent sessions for the user
  resetPasswordToken?: string;
  resetPasswordExpire?: Number;
  }
```
### Plan Collection
```typescript
{
  name: string;
  description: string;
  price: number;
  noOfDevices: number;
  features: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  }
```
### Session Collection (TTl-Time To Live Aut Expire)
```typescript
{
 expires: Date;
  session: {
    userId?: string;
    key: string;
    iv: string;
    createdAt?: number;
    [key: string]: any;
  };
  }
```

## 🔧 Configuration

### Environment Variables

Key environment variables for the backend:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5070` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/mern-template` |
| `REDIS_HOST` | Redis host | `127.0.0.1` |
| `REDIS_PORT` | Redis port | `6379` |
| `RABBITMQ_HOST` | RabbitMQ host | `localhost` |
| `RABBITMQ_PORT` | RabbitMQ port | `5672` |
### Redis Configuration

Redis is used for:
- Session storage
- API response caching
- Real-time data caching
- Rate limiting

### RabbitMQ Configuration

RabbitMQ is used for:
- Event-driven communication between services
- Asynchronous processing
- Notification queuing

