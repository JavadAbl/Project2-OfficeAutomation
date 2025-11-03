import { IsString } from 'class-validator';

export class OrganizationCreateRequest {
  @IsString()
  name: string;
}
