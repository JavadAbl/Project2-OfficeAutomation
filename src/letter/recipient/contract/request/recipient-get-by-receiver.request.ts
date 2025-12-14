import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString } from 'class-validator';
import { GetManyQueryRequest } from 'src/common/contract/request/get-many-query.request';

export class RecipientGetByReceiverRequest extends GetManyQueryRequest {
  @IsPositive()
  @Type(() => Number)
  receiverId: number;

  @IsOptional()
  @IsString()
  senderUsername: string;

  @IsOptional()
  @IsString()
  letterSubject: string;
}
