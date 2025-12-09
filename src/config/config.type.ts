import * as Joi from 'joi';
import { AppConfig } from './app.config';

export type ConfigType = {
  app: AppConfig;
};

export const configSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  DATABASE_ADDRESS: Joi.string().required(),
});

export enum nodeEnvs {
  Development = 'development',
  Production = 'production',
}

export const env = process.env.NODE_ENV;
export const isDev = env === nodeEnvs.Development;
