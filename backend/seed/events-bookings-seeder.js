const { DataSource } = require('typeorm');
require('dotenv').config({ path: '../.env' });

// Database configuration
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'reservation_app_events',
  entities: ['src/**/*.entity.ts'],
  synchronize: true,
});

async function seedEventsAndBookings() {
  try {
    console.log('🌱 Starting events and bookings seeding...');
    
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    // Get existing users
    const adminUsers = await AppDataSource.query(`
      SELECT id, email FROM users WHERE role = 'admin'
    `);
    const participantUsers = await AppDataSource.query(`
      SELECT id, email FROM users WHERE role = 'participant'
    `);
    
    console.log(`👑 Found ${adminUsers.length} admin users`);
    console.log(`👥 Found ${participantUsers.length} participant users`);
    console.log('📋 Events table columns:', ['id', 'createdAt', 'updatedAt', 'title', 'date', 'startTime', 'endTime', 'location', 'maxCapacity', 'currentBookings', 'status', 'createdById', 'description']);

    // Clear existing events and bookings
    await AppDataSource.query('DELETE FROM bookings');
    await AppDataSource.query('DELETE FROM events');
    console.log('🗑️ Cleared existing events and bookings');

    // Events to create (simplified to match actual schema)
    const eventsToCreate = [
      {
        title: 'Tech Summit 2024',
        description: 'Annual technology summit featuring latest innovations in AI, blockchain, and cloud computing',
        date: new Date('2024-03-15'),
        startTime: '09:00:00',
        endTime: '17:00:00',
        location: 'Riyadh Convention Center, Saudi Arabia',
        maxCapacity: 500,
        status: 'published'
      },
      {
        title: 'Digital Marketing Masterclass',
        description: 'Learn advanced digital marketing strategies from industry experts',
        date: new Date('2024-03-20'),
        startTime: '14:00:00',
        endTime: '18:00:00',
        location: 'Dubai Business Hub, UAE',
        maxCapacity: 200,
        status: 'published'
      },
      {
        title: 'Startup Pitch Competition',
        description: 'Compete for $100K funding in this exciting startup pitch event',
        date: new Date('2024-04-05'),
        startTime: '10:00:00',
        endTime: '16:00:00',
        location: 'Cairo Innovation Hub, Egypt',
        maxCapacity: 150,
        status: 'published'
      },
      {
        title: 'Web Development Bootcamp',
        description: 'Intensive 3-day bootcamp covering React, Node.js, and modern web technologies',
        date: new Date('2024-04-12'),
        startTime: '09:00:00',
        endTime: '17:00:00',
        location: 'Amman Tech Park, Jordan',
        maxCapacity: 100,
        status: 'published'
      },
      {
        title: 'Cultural Heritage Festival',
        description: 'Celebrate Middle Eastern culture with traditional music, food, and art',
        date: new Date('2024-04-20'),
        startTime: '16:00:00',
        endTime: '22:00:00',
        location: 'Doha Cultural Village, Qatar',
        maxCapacity: 1000,
        status: 'published'
      }
    ];

    // Seed Events (created by admins)
    console.log('📅 Seeding events...');
    const eventIds = [];
    
    for (let i = 0; i < eventsToCreate.length; i++) {
      const eventData = eventsToCreate[i];
      const creatorAdmin = adminUsers[i % adminUsers.length]; // Rotate between admins
      
      const result = await AppDataSource.query(`
        INSERT INTO events (title, description, date, "startTime", "endTime", location, "maxCapacity", status, "createdById", "currentBookings", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0, NOW(), NOW())
        RETURNING id
      `, [
        eventData.title,
        eventData.description,
        eventData.date,
        eventData.startTime,
        eventData.endTime,
        eventData.location,
        eventData.maxCapacity,
        eventData.status,
        creatorAdmin.id
      ]);
      
      eventIds.push(result[0].id);
      console.log(`   ✅ Created: ${eventData.title} (by ${creatorAdmin.email})`);
    }

    // Seed Bookings
    console.log('🎫 Seeding bookings...');
    const bookingsToCreate = [
      { eventIndex: 0, userIndex: 0, status: 'confirmed', notes: 'Excited to attend this tech summit!' },
      { eventIndex: 0, userIndex: 1, status: 'confirmed', notes: 'Looking forward to networking opportunities' },
      { eventIndex: 0, userIndex: 2, status: 'pending', notes: 'Hope to get confirmed soon' },
      { eventIndex: 1, userIndex: 0, status: 'confirmed', notes: 'Need to improve my marketing skills' },
      { eventIndex: 1, userIndex: 3, status: 'pending', notes: 'Interested in social media marketing' },
      { eventIndex: 2, userIndex: 4, status: 'confirmed', notes: 'Ready to pitch my startup idea!' },
      { eventIndex: 2, userIndex: 5, status: 'refused', notes: 'Applied but got rejected' },
      { eventIndex: 3, userIndex: 1, status: 'confirmed', notes: 'Want to learn React development' },
      { eventIndex: 3, userIndex: 2, status: 'canceled', notes: 'Had to cancel due to work conflict' },
      { eventIndex: 4, userIndex: 3, status: 'confirmed', notes: 'Love cultural events!' },
      { eventIndex: 4, userIndex: 4, status: 'confirmed', notes: 'Bringing my family' },
      { eventIndex: 4, userIndex: 5, status: 'pending', notes: 'Waiting for confirmation' }
    ];

    let bookingsCreated = 0;
    for (const bookingData of bookingsToCreate) {
      if (bookingData.eventIndex < eventIds.length && bookingData.userIndex < participantUsers.length) {
        await AppDataSource.query(`
          INSERT INTO bookings ("eventId", "userId", status, notes, "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, NOW(), NOW())
        `, [
          eventIds[bookingData.eventIndex],
          participantUsers[bookingData.userIndex].id,
          bookingData.status,
          bookingData.notes
        ]);
        bookingsCreated++;
      }
    }
    console.log(`✅ Created ${bookingsCreated} bookings`);

    // Update event booking counts
    console.log('🔄 Updating event booking counts...');
    await AppDataSource.query(`
      UPDATE events 
      SET "currentBookings" = (
        SELECT COUNT(*) 
        FROM bookings 
        WHERE bookings."eventId" = events.id 
        AND bookings.status IN ('confirmed', 'pending')
      )
    `);

    console.log('🎉 Events and bookings seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   📅 Events: ${eventsToCreate.length} created`);
    console.log(`   🎫 Bookings: ${bookingsCreated} created`);
    console.log('\n📋 Event IDs:');
    eventIds.forEach((id, index) => {
      console.log(`   ${index + 1}. ${eventsToCreate[index].title}: ${id}`);
    });

  } catch (error) {
    console.error('❌ Error seeding events and bookings:', error);
  } finally {
    await AppDataSource.destroy();
    process.exit(0);
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedEventsAndBookings();
}

module.exports = { seedEventsAndBookings };