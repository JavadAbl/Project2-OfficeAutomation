import { Type } from 'class-transformer';
import { IsPositive } from 'class-validator';
import { GetManyQueryRequest } from 'src/common/contract/request/get-many-query.request';

export class RecipientGetManyRequest extends GetManyQueryRequest {
  @Type(() => Number)
  @IsPositive()
  userId: string;
}
