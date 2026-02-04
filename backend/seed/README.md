# Database Seeder & API Testing

## 🌱 Database Seeding

### Quick Start
```bash
cd seed
npm install
npm run seed
```

### What Gets Seeded

#### 👥 Users (8 total)
- **2 Admins:**
  - Ahmed Hassan (ahmed.admin@eventbooking.com)
  - Fatima Al-Zahra (fatima.admin@eventbooking.com)
- **6 Participants:**
  - Mohammed Ali (mohammed.ali@gmail.com)
  - Aisha Omar (aisha.omar@gmail.com)
  - Khalid Ibrahim (khalid.ibrahim@gmail.com)
  - Nour Mansour (nour.mansour@gmail.com)
  - Omar Saleh (omar.saleh@gmail.com)
  - Layla Ahmed (layla.ahmed@gmail.com)

#### 📅 Events (8 total)
- Tech Summit 2024 (event-001)
- Digital Marketing Masterclass (event-002)
- Startup Pitch Competition (event-003)
- Web Development Bootcamp (event-004)
- Cultural Heritage Festival (event-005)
- Fitness & Wellness Expo (event-006)
- Blockchain & Cryptocurrency Summit (event-007)
- Photography Workshop (event-008) - COMPLETED

#### 🎫 Bookings (15 total)
- 9 CONFIRMED bookings
- 4 PENDING bookings
- 1 REFUSED booking
- 1 CANCELED booking

### Test Credentials
```
Admin Login:
Email: ahmed.admin@eventbooking.com
Password: Admin123!

User Login:
Email: mohammed.ali@gmail.com
Password: User123!
```

## 📮 Postman Collection

### Import Collection
1. Open Postman
2. Import `postman/Event-Booking-System-API.postman_collection.json`
3. Collection includes all endpoints with real data

### Pre-configured Variables
- `baseUrl`: http://localhost:3000/api
- `adminEmail`: ahmed.admin@eventbooking.com
- `adminPassword`: Admin123!
- `userEmail`: mohammed.ali@gmail.com
- `userPassword`: User123!
- `eventId`: event-001
- `bookingId`: booking-001
- `userId`: user-001

### Testing Workflow
1. **Login as Admin** → Get auth token
2. **Set authToken variable** → Copy token from login response
3. **Test Admin endpoints** → Confirm/refuse bookings
4. **Login as User** → Get user auth token
5. **Test User endpoints** → Create bookings, download tickets

### Key Endpoints to Test
- `POST /auth/login` - Login with seeded credentials
- `GET /bookings/my` - Get user's bookings
- `PATCH /bookings/{id}/confirm` - Admin confirms booking
- `GET /bookings/{id}/download-ticket` - Download ticket with token
- `POST /bookings/verify-ticket` - Verify QR code

## 🔄 Reset Database
```bash
npm run seed  # Clears and re-seeds all data
```

## 📊 Seed Data IDs

### Users
- admin-001, admin-002 (Admins)
- user-001 to user-006 (Participants)

### Events
- event-001 to event-008

### Bookings
- booking-001 to booking-015

Use these IDs in your API testing!