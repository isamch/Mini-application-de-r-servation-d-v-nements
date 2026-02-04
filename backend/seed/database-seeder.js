const { DataSource } = require('typeorm');
const bcrypt = require('bcrypt');

// Database configuration
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'event_booking',
  entities: ['src/**/*.entity.ts'],
  synchronize: true,
});

// Seed data
const seedData = {
  users: [
    // Admins
    {
      id: 'admin-001',
      firstName: 'Ahmed',
      lastName: 'Hassan',
      email: 'ahmed.admin@eventbooking.com',
      password: 'Admin123!',
      phone: '+966501234567',
      role: 'ADMIN'
    },
    {
      id: 'admin-002',
      firstName: 'Fatima',
      lastName: 'Al-Zahra',
      email: 'fatima.admin@eventbooking.com',
      password: 'Admin123!',
      phone: '+966501234568',
      role: 'ADMIN'
    },
    // Participants
    {
      id: 'user-001',
      firstName: 'Mohammed',
      lastName: 'Ali',
      email: 'mohammed.ali@gmail.com',
      password: 'User123!',
      phone: '+966501234569',
      role: 'PARTICIPANT'
    },
    {
      id: 'user-002',
      firstName: 'Aisha',
      lastName: 'Omar',
      email: 'aisha.omar@gmail.com',
      password: 'User123!',
      phone: '+966501234570',
      role: 'PARTICIPANT'
    },
    {
      id: 'user-003',
      firstName: 'Khalid',
      lastName: 'Ibrahim',
      email: 'khalid.ibrahim@gmail.com',
      password: 'User123!',
      phone: '+966501234571',
      role: 'PARTICIPANT'
    },
    {
      id: 'user-004',
      firstName: 'Nour',
      lastName: 'Mansour',
      email: 'nour.mansour@gmail.com',
      password: 'User123!',
      phone: '+966501234572',
      role: 'PARTICIPANT'
    },
    {
      id: 'user-005',
      firstName: 'Omar',
      lastName: 'Saleh',
      email: 'omar.saleh@gmail.com',
      password: 'User123!',
      phone: '+966501234573',
      role: 'PARTICIPANT'
    },
    {
      id: 'user-006',
      firstName: 'Layla',
      lastName: 'Ahmed',
      email: 'layla.ahmed@gmail.com',
      password: 'User123!',
      phone: '+966501234574',
      role: 'PARTICIPANT'
    }
  ],
  
  events: [
    {
      id: 'event-001',
      title: 'Tech Summit 2024',
      description: 'Annual technology summit featuring latest innovations in AI, blockchain, and cloud computing',
      date: new Date('2024-03-15T09:00:00Z'),
      location: 'Riyadh Convention Center, Saudi Arabia',
      capacity: 500,
      price: 299.99,
      category: 'TECHNOLOGY',
      status: 'ACTIVE',
      createdById: 'admin-001'
    },
    {
      id: 'event-002',
      title: 'Digital Marketing Masterclass',
      description: 'Learn advanced digital marketing strategies from industry experts',
      date: new Date('2024-03-20T14:00:00Z'),
      location: 'Dubai Business Hub, UAE',
      capacity: 200,
      price: 199.99,
      category: 'BUSINESS',
      status: 'ACTIVE',
      createdById: 'admin-001'
    },
    {
      id: 'event-003',
      title: 'Startup Pitch Competition',
      description: 'Compete for $100K funding in this exciting startup pitch event',
      date: new Date('2024-04-05T10:00:00Z'),
      location: 'Cairo Innovation Hub, Egypt',
      capacity: 150,
      price: 0,
      category: 'BUSINESS',
      status: 'ACTIVE',
      createdById: 'admin-002'
    },
    {
      id: 'event-004',
      title: 'Web Development Bootcamp',
      description: 'Intensive 3-day bootcamp covering React, Node.js, and modern web technologies',
      date: new Date('2024-04-12T09:00:00Z'),
      location: 'Amman Tech Park, Jordan',
      capacity: 100,
      price: 399.99,
      category: 'TECHNOLOGY',
      status: 'ACTIVE',
      createdById: 'admin-001'
    },
    {
      id: 'event-005',
      title: 'Cultural Heritage Festival',
      description: 'Celebrate Middle Eastern culture with traditional music, food, and art',
      date: new Date('2024-04-20T16:00:00Z'),
      location: 'Doha Cultural Village, Qatar',
      capacity: 1000,
      price: 50.00,
      category: 'CULTURAL',
      status: 'ACTIVE',
      createdById: 'admin-002'
    },
    {
      id: 'event-006',
      title: 'Fitness & Wellness Expo',
      description: 'Discover the latest in fitness equipment, nutrition, and wellness trends',
      date: new Date('2024-05-01T08:00:00Z'),
      location: 'Kuwait International Fair, Kuwait',
      capacity: 300,
      price: 25.00,
      category: 'SPORTS',
      status: 'ACTIVE',
      createdById: 'admin-001'
    },
    {
      id: 'event-007',
      title: 'Blockchain & Cryptocurrency Summit',
      description: 'Deep dive into blockchain technology and cryptocurrency investments',
      date: new Date('2024-05-15T10:00:00Z'),
      location: 'Bahrain Financial Harbor, Bahrain',
      capacity: 250,
      price: 499.99,
      category: 'TECHNOLOGY',
      status: 'ACTIVE',
      createdById: 'admin-002'
    },
    {
      id: 'event-008',
      title: 'Photography Workshop',
      description: 'Master the art of photography with professional photographers',
      date: new Date('2024-02-10T13:00:00Z'),
      location: 'Beirut Art Center, Lebanon',
      capacity: 50,
      price: 150.00,
      category: 'CULTURAL',
      status: 'COMPLETED',
      createdById: 'admin-001'
    }
  ],

  bookings: [
    // Event 1 bookings
    {
      id: 'booking-001',
      eventId: 'event-001',
      userId: 'user-001',
      status: 'CONFIRMED',
      notes: 'Excited to attend this tech summit!',
      createdAt: new Date('2024-02-01T10:00:00Z')
    },
    {
      id: 'booking-002',
      eventId: 'event-001',
      userId: 'user-002',
      status: 'CONFIRMED',
      notes: 'Looking forward to networking opportunities',
      createdAt: new Date('2024-02-02T14:30:00Z')
    },
    {
      id: 'booking-003',
      eventId: 'event-001',
      userId: 'user-003',
      status: 'PENDING',
      notes: 'Hope to get confirmed soon',
      createdAt: new Date('2024-02-15T09:15:00Z')
    },
    
    // Event 2 bookings
    {
      id: 'booking-004',
      eventId: 'event-002',
      userId: 'user-001',
      status: 'CONFIRMED',
      notes: 'Need to improve my marketing skills',
      createdAt: new Date('2024-02-05T11:20:00Z')
    },
    {
      id: 'booking-005',
      eventId: 'event-002',
      userId: 'user-004',
      status: 'PENDING',
      notes: 'Interested in social media marketing',
      createdAt: new Date('2024-02-10T16:45:00Z')
    },
    
    // Event 3 bookings
    {
      id: 'booking-006',
      eventId: 'event-003',
      userId: 'user-005',
      status: 'CONFIRMED',
      notes: 'Ready to pitch my startup idea!',
      createdAt: new Date('2024-02-08T12:00:00Z')
    },
    {
      id: 'booking-007',
      eventId: 'event-003',
      userId: 'user-006',
      status: 'REFUSED',
      notes: 'Applied but got rejected',
      cancelReason: 'Application did not meet requirements',
      createdAt: new Date('2024-02-12T08:30:00Z')
    },
    
    // Event 4 bookings
    {
      id: 'booking-008',
      eventId: 'event-004',
      userId: 'user-002',
      status: 'CONFIRMED',
      notes: 'Want to learn React development',
      createdAt: new Date('2024-02-20T15:10:00Z')
    },
    {
      id: 'booking-009',
      eventId: 'event-004',
      userId: 'user-003',
      status: 'CANCELED',
      notes: 'Had to cancel due to work conflict',
      cancelReason: 'Work schedule conflict',
      createdAt: new Date('2024-02-18T10:45:00Z')
    },
    
    // Event 5 bookings
    {
      id: 'booking-010',
      eventId: 'event-005',
      userId: 'user-004',
      status: 'CONFIRMED',
      notes: 'Love cultural events!',
      createdAt: new Date('2024-02-25T13:20:00Z')
    },
    {
      id: 'booking-011',
      eventId: 'event-005',
      userId: 'user-005',
      status: 'CONFIRMED',
      notes: 'Bringing my family',
      createdAt: new Date('2024-02-26T17:30:00Z')
    },
    {
      id: 'booking-012',
      eventId: 'event-005',
      userId: 'user-006',
      status: 'PENDING',
      notes: 'Waiting for confirmation',
      createdAt: new Date('2024-02-28T09:00:00Z')
    },
    
    // Event 6 bookings
    {
      id: 'booking-013',
      eventId: 'event-006',
      userId: 'user-001',
      status: 'CONFIRMED',
      notes: 'Need to get back in shape',
      createdAt: new Date('2024-03-01T07:45:00Z')
    },
    
    // Event 7 bookings
    {
      id: 'booking-014',
      eventId: 'event-007',
      userId: 'user-003',
      status: 'PENDING',
      notes: 'Interested in crypto investments',
      createdAt: new Date('2024-03-05T14:15:00Z')
    },
    
    // Event 8 bookings (completed event)
    {
      id: 'booking-015',
      eventId: 'event-008',
      userId: 'user-002',
      status: 'CONFIRMED',
      notes: 'Great workshop, learned a lot!',
      createdAt: new Date('2024-01-15T12:00:00Z')
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    // Clear existing data
    await AppDataSource.query('DELETE FROM bookings');
    await AppDataSource.query('DELETE FROM events');
    await AppDataSource.query('DELETE FROM users');
    console.log('🗑️  Cleared existing data');

    // Seed Users
    console.log('👥 Seeding users...');
    for (const userData of seedData.users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await AppDataSource.query(`
        INSERT INTO users (id, "firstName", "lastName", email, password, phone, role, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      `, [
        userData.id,
        userData.firstName,
        userData.lastName,
        userData.email,
        hashedPassword,
        userData.phone,
        userData.role
      ]);
    }
    console.log(`✅ Seeded ${seedData.users.length} users`);

    // Seed Events
    console.log('📅 Seeding events...');
    for (const eventData of seedData.events) {
      await AppDataSource.query(`
        INSERT INTO events (id, title, description, date, location, capacity, price, category, status, "createdById", "currentBookings", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0, NOW(), NOW())
      `, [
        eventData.id,
        eventData.title,
        eventData.description,
        eventData.date,
        eventData.location,
        eventData.capacity,
        eventData.price,
        eventData.category,
        eventData.status,
        eventData.createdById
      ]);
    }
    console.log(`✅ Seeded ${seedData.events.length} events`);

    // Seed Bookings
    console.log('🎫 Seeding bookings...');
    for (const bookingData of seedData.bookings) {
      await AppDataSource.query(`
        INSERT INTO bookings (id, "eventId", "userId", status, notes, "cancelReason", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      `, [
        bookingData.id,
        bookingData.eventId,
        bookingData.userId,
        bookingData.status,
        bookingData.notes,
        bookingData.cancelReason || null,
        bookingData.createdAt
      ]);
    }
    console.log(`✅ Seeded ${seedData.bookings.length} bookings`);

    // Update event booking counts
    console.log('🔄 Updating event booking counts...');
    await AppDataSource.query(`
      UPDATE events 
      SET "currentBookings" = (
        SELECT COUNT(*) 
        FROM bookings 
        WHERE bookings."eventId" = events.id 
        AND bookings.status IN ('CONFIRMED', 'PENDING')
      )
    `);
    console.log('✅ Updated event booking counts');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Seeded Data Summary:');
    console.log(`   👥 Users: ${seedData.users.length} (2 Admins, ${seedData.users.length - 2} Participants)`);
    console.log(`   📅 Events: ${seedData.events.length} (7 Active, 1 Completed)`);
    console.log(`   🎫 Bookings: ${seedData.bookings.length} (9 Confirmed, 4 Pending, 1 Refused, 1 Canceled)`);
    console.log('\n🔑 Test Credentials:');
    console.log('   Admin: ahmed.admin@eventbooking.com / Admin123!');
    console.log('   User: mohammed.ali@gmail.com / User123!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await AppDataSource.destroy();
    process.exit(0);
  }
}

// Export seed data for use in tests
module.exports = { seedData, seedDatabase };

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}