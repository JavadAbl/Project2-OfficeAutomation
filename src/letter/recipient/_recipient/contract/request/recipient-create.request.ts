import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsPositive } from 'class-validator';

export class RecipientCreateRequest {
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsPositive({ each: true })
  receiverIds: number[];

  @IsPositive()
  letterId: number;
}
