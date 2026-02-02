import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = (): JwtModuleOptions => ({
secret: process.env.JWT_SECRET || 'your-secret-key',
signOptions: {
expiresIn: (process.env.JWT_EXPIRATION as any) || '7d',
},
});
