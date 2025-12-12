import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from '../constants/keys';

export const Public = () => SetMetadata(PUBLIC_KEY, true);
