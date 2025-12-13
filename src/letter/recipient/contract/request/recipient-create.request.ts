import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsPositive } from 'class-validator';

export class RecipientCreateRequest {
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsPositive({ each: true })
  userIds: number[];

  @IsPositive()
  letterId: number;
}
