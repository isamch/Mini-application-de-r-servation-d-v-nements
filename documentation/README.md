# Event Booking System API Documentation

## Overview

The Event Booking System is a comprehensive backend API built with NestJS that manages events, user registrations, and booking operations. The system supports role-based access control with Admin and Participant roles, providing secure endpoints for event management and booking workflows.

## Base URL
```
http://localhost:3000/api
```

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All successful API responses are wrapped in a consistent format:
```json
{
  "data": {
    // Response data here
  }
}
```

## User Roles

- **Admin**: Full system access, can manage events, users, and bookings
- **Participant**: Can view published events, create bookings, and manage their own profile

## Status Enums

### Event Status
- `draft`: Event is being prepared
- `published`: Event is available for booking
- `canceled`: Event has been canceled

### Booking Status
- `pending`: Booking awaits admin confirmation
- `confirmed`: Booking is approved and active
- `refused`: Booking was rejected by admin
- `canceled`: Booking was canceled

---

# Authentication Endpoints

## POST /auth/register
**Description**: Register a new user account  
**Access**: Public  
**Content-Type**: application/json

### Request Body
```json
{
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "password": "string",
  "phone": "string (optional)",
  "role": "participant"
}
```

### Validation Rules
- `email`: Must be valid email format
- `password`: Minimum 8 characters, must contain uppercase, lowercase, and number
- `firstName`: Required string
- `lastName`: Required string
- `phone`: Optional, valid phone format
- `role`: Must be "participant" (admin accounts created by existing admins)

### Response (201 Created)
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "participant",
    "isActive": true,
    "isEmailVerified": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## POST /auth/login
**Description**: Authenticate user with email and password  
**Access**: Public  
**Content-Type**: application/json

### Request Body
```json
{
  "email": "string",
  "password": "string"
}
```

### Validation Rules
- `email`: Must be valid email format
- `password`: Minimum 6 characters

### Response (200 OK)
```json
{
  "data": {
    "access_token": "jwt-token-string",
    "refresh_token": "refresh-token-string",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "participant",
      "permissions": ["read_events", "create_bookings"]
    }
  }
}
```

---

## POST /auth/refresh
**Description**: Refresh JWT access token  
**Access**: Public  
**Content-Type**: application/json

### Request Body
```json
{
  "refresh_token": "string"
}
```

### Response (200 OK)
```json
{
  "data": {
    "access_token": "new-jwt-token-string",
    "refresh_token": "new-refresh-token-string"
  }
}
```

---

## POST /auth/logout
**Description**: Logout user and invalidate tokens  
**Access**: Authenticated  
**Authorization**: Bearer token required

### Response (200 OK)
```json
{
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## GET /auth/profile
**Description**: Get current user profile information  
**Access**: Authenticated  
**Authorization**: Bearer token required

### Response (200 OK)
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "role": "participant",
      "isActive": true,
      "isEmailVerified": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

---

# Events Endpoints

## POST /events
**Description**: Create new event (Admin only)  
**Access**: Admin  
**Authorization**: Bearer token required  
**Content-Type**: application/json

### Request Body
```json
{
  "title": "string",
  "description": "string",
  "date": "YYYY-MM-DD",
  "startTime": "HH:MM:SS",
  "endTime": "HH:MM:SS", 
  "location": "string",
  "maxCapacity": "number",
  "status": "draft|published|canceled (optional, defaults to draft)"
}
```

### Validation Rules
- `title`: Required, max 200 characters
- `description`: Required string
- `date`: Valid date string (YYYY-MM-DD)
- `startTime`: Valid time format (HH:MM:SS)
- `endTime`: Valid time format (HH:MM:SS)
- `location`: Required string
- `maxCapacity`: Minimum 1 participant
- `status`: Optional, defaults to "draft"

### Response (201 Created)
```json
{
  "data": {
    "id": "uuid",
    "title": "Web Development Workshop",
    "description": "Learn modern web development",
    "date": "2024-07-15T00:00:00Z",
    "startTime": "09:00:00",
    "endTime": "17:00:00",
    "location": "Conference Room A",
    "maxCapacity": 50,
    "currentBookings": 0,
    "status": "draft",
    "createdById": "admin-uuid",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## GET /events
**Description**: Get all events with optional filters (Admin only)  
**Access**: Admin  
**Authorization**: Bearer token required

### Query Parameters
- `status`: Filter by event status (draft|published|canceled)
- `title`: Search by title (partial match)
- `location`: Filter by location
- `date`: Filter by specific date
- `page`: Page number for pagination
- `limit`: Items per page

### Response (200 OK)
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Web Development Workshop",
      "description": "Learn modern web development",
      "date": "2024-07-15T00:00:00Z",
      "startTime": "09:00:00",
      "endTime": "17:00:00",
      "location": "Conference Room A",
      "maxCapacity": 50,
      "currentBookings": 15,
      "status": "published",
      "createdById": "admin-uuid",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": {
        "id": "admin-uuid",
        "firstName": "Admin",
        "lastName": "User",
        "email": "admin@example.com"
      }
    }
  ]
}
```

---

## GET /events/published
**Description**: Get published events only (Public access)  
**Access**: Public

### Query Parameters
- `title`: Search by title (partial match)
- `location`: Filter by location
- `date`: Filter by specific date
- `page`: Page number for pagination
- `limit`: Items per page

### Response (200 OK)
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Web Development Workshop",
      "description": "Learn modern web development",
      "date": "2024-07-15T00:00:00Z",
      "startTime": "09:00:00",
      "endTime": "17:00:00",
      "location": "Conference Room A",
      "maxCapacity": 50,
      "currentBookings": 15,
      "status": "published",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## GET /events/search
**Description**: Advanced search for events with filters (Public access)  
**Access**: Public

### Query Parameters
- `title`: Search by title (partial match)
- `location`: Filter by location
- `date`: Filter by specific date
- `status`: Filter by status (only published events returned for public)
- `page`: Page number for pagination
- `limit`: Items per page

### Response (200 OK)
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Tech Conference 2024",
      "description": "Latest technology trends",
      "date": "2024-07-15T00:00:00Z",
      "startTime": "09:00:00",
      "endTime": "17:00:00",
      "location": "Riyadh Convention Center",
      "maxCapacity": 300,
      "currentBookings": 150,
      "status": "published",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## GET /events/my
**Description**: Get events created by current user  
**Access**: Authenticated  
**Authorization**: Bearer token required

### Response (200 OK)
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "My Workshop",
      "description": "Workshop I created",
      "date": "2024-07-15T00:00:00Z",
      "startTime": "09:00:00",
      "endTime": "17:00:00",
      "location": "My Venue",
      "maxCapacity": 30,
      "currentBookings": 10,
      "status": "published",
      "createdById": "current-user-uuid",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## GET /events/:id
**Description**: Get event by ID (Public access)  
**Access**: Public

### Path Parameters
- `id`: Event UUID

### Response (200 OK)
```json
{
  "data": {
    "id": "uuid",
    "title": "Web Development Workshop",
    "description": "Learn modern web development with React and Node.js",
    "date": "2024-07-15T00:00:00Z",
    "startTime": "09:00:00",
    "endTime": "17:00:00",
    "location": "Conference Room A, Building 1",
    "maxCapacity": 50,
    "currentBookings": 15,
    "status": "published",
    "createdById": "admin-uuid",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": {
      "id": "admin-uuid",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@example.com"
    }
  }
}
```

### Response (404 Not Found)
```json
{
  "statusCode": 404,
  "message": "Event not found",
  "error": "Not Found"
}
```

---

## GET /events/:id/available-spots
**Description**: Check available spots for event (Public access)  
**Access**: Public

### Path Parameters
- `id`: Event UUID

### Response (200 OK)
```json
{
  "data": 35
}
```

---

## GET /events/:id/validate-booking
**Description**: Validate event for booking (Internal use)  
**Access**: Authenticated  
**Authorization**: Bearer token required

### Path Parameters
- `id`: Event UUID

### Response (200 OK)
```json
{
  "data": {
    "id": "uuid",
    "title": "Web Development Workshop",
    "status": "published",
    "maxCapacity": 50,
    "currentBookings": 15,
    "date": "2024-07-15T00:00:00Z"
  }
}
```

---

## PATCH /events/:id
**Description**: Update event information  
**Access**: Admin or Event Creator  
**Authorization**: Bearer token required  
**Content-Type**: application/json

### Path Parameters
- `id`: Event UUID

### Request Body (Partial Update)
```json
{
  "title": "Updated Workshop Title",
  "description": "Updated description",
  "maxCapacity": 100
}
```

### Response (200 OK)
```json
{
  "data": {
    "id": "uuid",
    "title": "Updated Workshop Title",
    "description": "Updated description",
    "date": "2024-07-15T00:00:00Z",
    "startTime": "09:00:00",
    "endTime": "17:00:00",
    "location": "Conference Room A",
    "maxCapacity": 100,
    "currentBookings": 15,
    "status": "published",
    "createdById": "admin-uuid",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:45:00Z"
  }
}
```

---

## PATCH /events/:id/status
**Description**: Update event status  
**Access**: Admin or Event Creator  
**Authorization**: Bearer token required  
**Content-Type**: application/json

### Path Parameters
- `id`: Event UUID

### Request Body
```json
{
  "status": "published"
}
```

### Response (200 OK)
```json
{
  "data": {
    "id": "uuid",
    "title": "Web Development Workshop",
    "status": "published",
    "updatedAt": "2024-01-15T11:45:00Z"
  }
}
```

---

## DELETE /events/:id
**Description**: Delete event  
**Access**: Admin or Event Creator  
**Authorization**: Bearer token required

### Path Parameters
- `id`: Event UUID

### Response (200 OK)
```json
{
  "data": {
    "message": "Event deleted successfully"
  }
}
```

---

# Bookings Endpoints

## POST /bookings
**Description**: Create new booking  
**Access**: Authenticated (Participants)  
**Authorization**: Bearer token required  
**Content-Type**: application/json

### Request Body
```json
{
  "eventId": "uuid",
  "notes": "string (optional, max 500 characters)"
}
```

### Validation Rules
- `eventId`: Required, valid UUID
- `notes`: Optional, max 500 characters

### Response (201 Created)
```json
{
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "eventId": "event-uuid",
    "status": "pending",
    "notes": "Looking forward to this event!",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "user": {
      "id": "user-uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "event": {
      "id": "event-uuid",
      "title": "Web Development Workshop",
      "date": "2024-07-15T00:00:00Z",
      "location": "Conference Room A"
    }
  }
}
```

---

## GET /bookings
**Description**: Get all bookings with optional filters (Admin only)  
**Access**: Admin  
**Authorization**: Bearer token required

### Query Parameters
- `status`: Filter by booking status (pending|confirmed|refused|canceled)
- `eventId`: Filter by specific event
- `userId`: Filter by specific user
- `page`: Page number for pagination
- `limit`: Items per page

### Response (200 OK)
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "user-uuid",
      "eventId": "event-uuid",
      "status": "confirmed",
      "notes": "Special dietary requirements",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T11:00:00Z",
      "user": {
        "id": "user-uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      },
      "event": {
        "id": "event-uuid",
        "title": "Web Development Workshop",
        "date": "2024-07-15T00:00:00Z",
        "startTime": "09:00:00",
        "endTime": "17:00:00",
        "location": "Conference Room A"
      }
    }
  ]
}
```

---

## GET /bookings/my
**Description**: Get current user's bookings  
**Access**: Authenticated  
**Authorization**: Bearer token required

### Response (200 OK)
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "current-user-uuid",
      "eventId": "event-uuid",
      "status": "confirmed",
      "notes": "My booking notes",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T11:00:00Z",
      "event": {
        "id": "event-uuid",
        "title": "Web Development Workshop",
        "date": "2024-07-15T00:00:00Z",
        "startTime": "09:00:00",
        "endTime": "17:00:00",
        "location": "Conference Room A",
        "maxCapacity": 50,
        "currentBookings": 25
      }
    }
  ]
}
```

---

## GET /bookings/stats
**Description**: Get booking statistics (Admin only)  
**Access**: Admin  
**Authorization**: Bearer token required

### Query Parameters
- `eventId`: Get stats for specific event (optional)

### Response (200 OK)
```json
{
  "data": {
    "total": 150,
    "pending": 25,
    "confirmed": 100,
    "refused": 15,
    "canceled": 10,
    "byEvent": {
      "event-uuid-1": {
        "eventTitle": "Workshop 1",
        "total": 50,
        "confirmed": 40,
        "pending": 10
      },
      "event-uuid-2": {
        "eventTitle": "Workshop 2", 
        "total": 100,
        "confirmed": 60,
        "pending": 15,
        "refused": 15,
        "canceled": 10
      }
    }
  }
}
```

---

## GET /bookings/event/:eventId
**Description**: Get bookings for specific event (Admin only)  
**Access**: Admin  
**Authorization**: Bearer token required

### Path Parameters
- `eventId`: Event UUID

### Response (200 OK)
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "user-uuid",
      "eventId": "event-uuid",
      "status": "confirmed",
      "notes": "Participant notes",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T11:00:00Z",
      "user": {
        "id": "user-uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      }
    }
  ]
}
```

---

## GET /bookings/:id
**Description**: Get booking by ID  
**Access**: Authenticated (Own bookings or Admin)  
**Authorization**: Bearer token required

### Path Parameters
- `id`: Booking UUID

### Response (200 OK)
```json
{
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "eventId": "event-uuid",
    "status": "confirmed",
    "notes": "My booking notes",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z",
    "user": {
      "id": "user-uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "event": {
      "id": "event-uuid",
      "title": "Web Development Workshop",
      "date": "2024-07-15T00:00:00Z",
      "startTime": "09:00:00",
      "endTime": "17:00:00",
      "location": "Conference Room A"
    }
  }
}
```

---

## PATCH /bookings/:id/notes
**Description**: Update booking notes  
**Access**: Authenticated (Own bookings only)  
**Authorization**: Bearer token required  
**Content-Type**: application/json

### Path Parameters
- `id`: Booking UUID

### Request Body
```json
{
  "notes": "Updated notes for my booking"
}
```

### Response (200 OK)
```json
{
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "eventId": "event-uuid",
    "status": "confirmed",
    "notes": "Updated notes for my booking",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

---

## PATCH /bookings/:id/cancel
**Description**: Cancel own booking  
**Access**: Authenticated (Own bookings only)  
**Authorization**: Bearer token required  
**Content-Type**: application/json

### Path Parameters
- `id`: Booking UUID

### Request Body
```json
{
  "cancelReason": "Personal reasons - cannot attend"
}
```

### Response (200 OK)
```json
{
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "eventId": "event-uuid",
    "status": "canceled",
    "cancelReason": "Personal reasons - cannot attend",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

---

## PATCH /bookings/:id/confirm
**Description**: Confirm pending booking (Admin only)  
**Access**: Admin  
**Authorization**: Bearer token required

### Path Parameters
- `id`: Booking UUID

### Response (200 OK)
```json
{
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "eventId": "event-uuid",
    "status": "confirmed",
    "updatedAt": "2024-01-15T12:00:00Z",
    "user": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "event": {
      "title": "Web Development Workshop",
      "date": "2024-07-15T00:00:00Z"
    }
  }
}
```

---

## PATCH /bookings/:id/refuse
**Description**: Refuse pending booking (Admin only)  
**Access**: Admin  
**Authorization**: Bearer token required  
**Content-Type**: application/json

### Path Parameters
- `id`: Booking UUID

### Request Body
```json
{
  "refuseReason": "Event is full - no more capacity"
}
```

### Response (200 OK)
```json
{
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "eventId": "event-uuid",
    "status": "refused",
    "cancelReason": "Event is full - no more capacity",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

---

## PATCH /bookings/:id/admin-cancel
**Description**: Cancel any booking (Admin only)  
**Access**: Admin  
**Authorization**: Bearer token required  
**Content-Type**: application/json

### Path Parameters
- `id`: Booking UUID

### Request Body
```json
{
  "cancelReason": "Event cancelled due to weather conditions"
}
```

### Response (200 OK)
```json
{
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "eventId": "event-uuid",
    "status": "canceled",
    "cancelReason": "Event cancelled due to weather conditions",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

---

## GET /bookings/:id/ticket-eligibility
**Description**: Check if user can download ticket  
**Access**: Authenticated (Own bookings only)  
**Authorization**: Bearer token required

### Path Parameters
- `id`: Booking UUID

### Response (200 OK)
```json
{
  "data": {
    "canDownload": true
  }
}
```

### Response (200 OK - Not Eligible)
```json
{
  "data": {
    "canDownload": false
  }
}
```

---

## GET /bookings/:id/ticket
**Description**: Download booking ticket (PDF)  
**Access**: Authenticated (Own bookings only)  
**Authorization**: Bearer token required

### Path Parameters
- `id`: Booking UUID

### Response (200 OK)
- **Content-Type**: application/pdf
- **Content-Disposition**: attachment; filename="ticket-{booking-id}.pdf"
- **Body**: PDF file binary data

---

## GET /bookings/:id/download-ticket
**Description**: Download booking ticket with token (Public access)  
**Access**: Public

### Path Parameters
- `id`: Booking UUID

### Query Parameters
- `token`: Secure download token

### Response (200 OK)
- **Content-Type**: application/pdf
- **Content-Disposition**: attachment; filename="ticket-{event-title}-{booking-id}.pdf"
- **Body**: PDF file binary data

---

## POST /bookings/verify-ticket
**Description**: Verify ticket using QR code (Public access)  
**Access**: Public  
**Content-Type**: application/json

### Request Body
```json
{
  "bookingId": "uuid",
  "eventId": "uuid", 
  "userId": "uuid",
  "hash": "verification-hash-string"
}
```

### Response (200 OK - Valid Ticket)
```json
{
  "data": {
    "valid": true,
    "booking": {
      "id": "uuid",
      "status": "confirmed",
      "user": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "event": {
        "title": "Web Development Workshop",
        "date": "2024-07-15T00:00:00Z",
        "location": "Conference Room A"
      }
    }
  }
}
```

### Response (200 OK - Invalid Ticket)
```json
{
  "data": {
    "valid": false,
    "reason": "Invalid ticket or booking not confirmed"
  }
}
```

---

# Users Endpoints

## POST /users
**Description**: Create new user account (Admin only)  
**Access**: Admin  
**Authorization**: Bearer token required  
**Content-Type**: application/json

### Request Body
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "phone": "string (optional)",
  "role": "participant|admin"
}
```

### Response (201 Created)
```json
{
  "data": {
    "id": "uuid",
    "email": "newuser@example.com",
    "firstName": "New",
    "lastName": "User",
    "phone": "+1234567890",
    "role": "participant",
    "isActive": true,
    "isEmailVerified": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## GET /users
**Description**: Get all users list (Admin only)  
**Access**: Admin  
**Authorization**: Bearer token required

### Query Parameters
- `role`: Filter by user role (participant|admin)
- `isActive`: Filter by active status (true|false)
- `page`: Page number for pagination
- `limit`: Items per page

### Response (200 OK)
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "role": "participant",
      "isActive": true,
      "isEmailVerified": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## GET /users/me
**Description**: Get current user profile  
**Access**: Authenticated  
**Authorization**: Bearer token required

### Response (200 OK)
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "participant",
    "permissions": ["read_events", "create_bookings"],
    "isActive": true,
    "isEmailVerified": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## PATCH /users/me
**Description**: Update current user profile  
**Access**: Authenticated  
**Authorization**: Bearer token required  
**Content-Type**: application/json

### Request Body (Partial Update)
```json
{
  "firstName": "John Updated",
  "lastName": "Doe Updated",
  "phone": "+1234567891"
}
```

### Response (200 OK)
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John Updated",
    "lastName": "Doe Updated",
    "phone": "+1234567891",
    "role": "participant",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

---

## GET /users/:id
**Description**: Get specific user by ID (Admin only)  
**Access**: Admin  
**Authorization**: Bearer token required

### Path Parameters
- `id`: User UUID

### Response (200 OK)
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "participant",
    "isActive": true,
    "isEmailVerified": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## PATCH /users/:id
**Description**: Update user information (Admin only)  
**Access**: Admin  
**Authorization**: Bearer token required  
**Content-Type**: application/json

### Path Parameters
- `id`: User UUID

### Request Body (Partial Update)
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "role": "admin",
  "isActive": false
}
```

### Response (200 OK)
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Updated",
    "lastName": "Name",
    "role": "admin",
    "isActive": false,
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

---

## DELETE /users/:id
**Description**: Delete user account (Admin only)  
**Access**: Admin  
**Authorization**: Bearer token required

### Path Parameters
- `id`: User UUID

### Response (200 OK)
```json
{
  "data": {
    "message": "User deleted successfully"
  }
}
```

---

# Error Responses

## Common Error Formats

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "email must be a valid email",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

# Data Models

## User Entity
```typescript
{
  id: string;                    // UUID
  email: string;                 // Unique email
  firstName: string;
  lastName: string;
  phone?: string;                // Optional phone number
  role: 'admin' | 'participant'; // User role
  permissions: string[];         // Array of permission strings
  isActive: boolean;             // Account status
  isEmailVerified: boolean;      // Email verification status
  createdAt: Date;
  updatedAt: Date;
}
```

## Event Entity
```typescript
{
  id: string;                    // UUID
  title: string;                 // Event title (max 200 chars)
  description: string;           // Event description
  date: Date;                    // Event date
  startTime: string;             // Start time (HH:MM:SS)
  endTime: string;               // End time (HH:MM:SS)
  location: string;              // Event location
  maxCapacity: number;           // Maximum participants
  currentBookings: number;       // Current booking count
  status: 'draft' | 'published' | 'canceled'; // Event status
  createdById: string;           // Creator user ID
  createdAt: Date;
  updatedAt: Date;
  createdBy?: User;              // Creator user object (relation)
  bookings?: Booking[];          // Event bookings (relation)
}
```

## Booking Entity
```typescript
{
  id: string;                    // UUID
  userId: string;                // User ID who made booking
  eventId: string;               // Event ID being booked
  status: 'pending' | 'confirmed' | 'refused' | 'canceled'; // Booking status
  notes?: string;                // Optional booking notes (max 500 chars)
  cancelReason?: string;         // Cancellation reason
  createdAt: Date;
  updatedAt: Date;
  user?: User;                   // User object (relation)
  event?: Event;                 // Event object (relation)
}
```

---

# Permissions System

## Admin Permissions
- `create_events`: Create new events
- `read_events`: View all events
- `update_events`: Modify events
- `delete_events`: Remove events
- `publish_events`: Change event status
- `view_all_events`: See all events regardless of status
- `create_user`: Create new user accounts
- `read_all_users`: View all users
- `update_user`: Modify user accounts
- `delete_user`: Remove user accounts
- `view_all_bookings`: See all bookings
- `manage_bookings`: Booking statistics and management
- `confirm_bookings`: Approve pending bookings
- `refuse_bookings`: Reject bookings
- `delete_bookings`: Cancel any booking

## Participant Permissions
- `read_events`: View published events
- `create_bookings`: Make event bookings
- `read_bookings`: View own bookings
- `update_bookings`: Modify own bookings
- `read_user`: View own profile
- `update_own_user`: Update own profile

---

# Rate Limiting

The API implements rate limiting to prevent abuse:
- **Authentication endpoints**: 5 requests per minute per IP
- **General endpoints**: 100 requests per minute per user
- **File downloads**: 10 requests per minute per user

---

# Environment Variables

Required environment variables for the API:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=event_booking

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application
PORT=3000
NODE_ENV=development
API_PREFIX=api
```

---

# Testing with Postman

The project includes a comprehensive Postman collection (`Event-Booking-System-API-Final.postman_collection.json`) with:

- Pre-configured environment variables
- Automated token management
- Complete test scenarios for all endpoints
- Example requests and responses

## Collection Variables
- `baseUrl`: http://localhost:3000/api
- `authToken`: Automatically managed
- `adminEmail`: ahmed.admin@eventbooking.com
- `adminPassword`: Admin123!
- `userEmail`: mohammed.ali@gmail.com
- `userPassword`: User123!

## Testing Workflow
1. Import the Postman collection
2. Run "Admin Login" or "User Login" to get authentication token
3. Token is automatically saved and used in subsequent requests
4. Test all endpoints with proper authentication and permissions

---

# Development Setup

## Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

## Installation
```bash
# Clone repository
git clone <repository-url>
cd event-booking-system

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migration:run

# Seed database with sample data
cd seed
npm install
npm run seed

# Start development server
npm run start:dev
```

## Database Seeding
The project includes a seeder that creates:
- Admin user: ahmed.admin@eventbooking.com / Admin123!
- Regular user: mohammed.ali@gmail.com / User123!
- Sample events and bookings

---

# Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin and Participant roles
- **Permission System**: Granular permissions for operations
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: TypeORM query builder
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Prevents API abuse
- **CORS Configuration**: Controlled cross-origin requests

---

# API Versioning

Current API version: v1  
Base URL includes version: `/api/v1` (currently `/api`)

Future versions will maintain backward compatibility and provide migration guides.

---

This documentation covers all endpoints, request/response formats, authentication, and usage examples for the Event Booking System API. For additional support or questions, please refer to the source code or contact the development team.