import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
type: 'postgres',
host: process.env.DATABASE_HOST || 'localhost',
port: parseInt(process.env.DATABASE_PORT || '5432', 10),
username: process.env.DATABASE_USER || 'postgres',
password: process.env.DATABASE_PASSWORD || '',
database: process.env.DATABASE_NAME || 'backend',
entities: [__dirname + '/../**/*.entity{.ts,.js}'],
synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
logging: process.env.DATABASE_LOGGING === 'true',
ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});
