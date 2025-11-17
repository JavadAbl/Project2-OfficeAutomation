import * as Joi from 'joi';
import { AppConfig } from './app.config';

export type ConfigType = {
  app: AppConfig;
};

export const configSchema = Joi.object({
  DATABASE_ADDRESS: Joi.string().required(),
});
