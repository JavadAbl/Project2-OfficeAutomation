import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString } from 'class-validator';
import { GetManyQueryRequest } from 'src/common/contract/request/get-many-query.request';

export class RecipientGetBySenderRequest extends GetManyQueryRequest {
  @IsPositive()
  @Type(() => Number)
  senderId: number;

  @IsOptional()
  @IsString()
  receiverUsername: string;

  @IsOptional()
  @IsString()
  letterSubject: string;
}
