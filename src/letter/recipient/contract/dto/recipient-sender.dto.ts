import { Exclude, Expose } from 'class-transformer';
import { UserDto } from 'src/identity/user/contract/dto/user.dto';
import { letterDto } from 'src/letter/contract/dto/letter.dto';

@Exclude()
export class RecipientSenderDto {
  @Expose()
  id: number;

  @Expose()
  receiver: UserDto;

  @Expose()
  letter: letterDto;
}
