import { IsOptional, IsPositive, IsString } from 'class-validator';
import { GetManyQueryRequest } from 'src/common/contract/request/get-many-query.request';

export class RecipientGetManyRequest extends GetManyQueryRequest {
  @IsPositive()
  receiverId: number;

  @IsOptional()
  @IsString()
  senderUsername: string;

  @IsOptional()
  @IsString()
  letterSubject: string;
}
