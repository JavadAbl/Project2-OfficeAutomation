import { Exclude, Expose } from 'class-transformer';
import { UserDto } from 'src/identity/user/_user/contract/dto/user.dto';
import { letterDto } from 'src/letter/_letter/contract/dto/letter.dto';

@Exclude()
export class RecipientReceiverDto {
  @Expose()
  id: number;

  @Expose()
  sender: UserDto;

  @Expose()
  letter: letterDto;
}
