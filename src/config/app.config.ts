import { registerAs } from '@nestjs/config';

export type AppConfig = { databaseAddress: string };

export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    databaseAddress: process.env.DATABASE_ADDRESS!,
  }),
);
