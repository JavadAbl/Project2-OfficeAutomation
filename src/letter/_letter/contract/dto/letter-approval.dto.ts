import { Exclude, Expose } from 'class-transformer';
import { letterDto } from './letter.dto';
import { UserDto } from 'src/identity/user/_user/contract/dto/user.dto';

@Exclude()
export class letterApprovalDto {
  @Expose()
  id: number;

  @Expose()
  letter: letterDto;

  @Expose()
  creatorUser: UserDto;

  @Expose()
  createdAt: Date;
}
