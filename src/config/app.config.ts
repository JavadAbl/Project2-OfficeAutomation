import { registerAs } from '@nestjs/config';

export type AppConfig = { databaseAddress: string; env: string };

export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    env: process.env.NODE_ENV!,
    databaseAddress: process.env.DATABASE_ADDRESS!,
  }),
);
