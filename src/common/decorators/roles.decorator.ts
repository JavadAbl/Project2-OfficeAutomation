import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../constants/keys';

export const Roles = (...roles: number[]) => SetMetadata(ROLES_KEY, roles);
