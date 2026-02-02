# backend

reservation app

## 🚀 Features

- ✅ Authentication (JWT)
- ✅ Email Verification
- ✅ Password Reset
- ✅ Refresh Tokens
- ✅ User Management
- ✅ Database Integration (postgresql)
- ✅ Email Service (SMTP)
- ✅ Pagination
- ✅ API Documentation (Swagger)
- ✅ Request Logging
- ✅ Error Handling
- ✅ Input Validation
- ✅ Module Generator (Isam Generator)

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### Required Environment Variables

**Database Configuration:**
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your-password
DATABASE_NAME=backend
```

**JWT Configuration:**
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Email Configuration:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🏃 Running the app

```bash
# development
npm run start:dev

# production
npm run start:prod
```

## 📚 API Documentation

Once the application is running, visit:
- **Swagger UI**: http://localhost:3000/api
- **JSON Schema**: http://localhost:3000/api-json

## 🛠️ Module Generation

Generate new modules using the Isam Generator:

```bash
# Generate a complete module
npm run isam:generate products

# This creates:
# - Controller with CRUD operations
# - Service with business logic
# - Entity with database model
# - DTOs with validation
# - Repository with custom queries
# - Permissions enum
# - Audit middleware
```

## 🔐 Authentication

### Register a new user
```bash
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
```bash
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Verify Email
```bash
POST /auth/verify-email
{
  "token": "verification-token-from-email"
}
```

### Reset Password
```bash
POST /auth/forgot-password
{
  "email": "user@example.com"
}

POST /auth/reset-password
{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123"
}
```

## 🏗️ Project Structure

```
src/
├── common/           # Shared utilities, guards, decorators
├── config/           # Configuration files
├── modules/          # Feature modules
│   ├── auth/         # Authentication module
│   ├── users/        # User management module
│   ├── email/        # Email service module
├── app.module.ts     # Root module
└── main.ts           # Application entry point
```

## 🧪 Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## 🚀 Deployment

### Using Docker

```bash
# Build and run with docker-compose
docker-compose up -d

# Or build manually
docker build -t backend .
docker run -p 3000:3000 backend
```

### Environment Setup

1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure proper database credentials
4. Set up email service (SMTP)
5. Configure CORS for your domain

## 📝 License

MIT

---

Generated with [Isam NestJS Starter CLI](https://github.com/your-repo/isam-nestjs-starter-cli) 🔥