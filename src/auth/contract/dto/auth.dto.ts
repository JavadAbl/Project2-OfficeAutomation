import { Exclude, Expose } from 'class-transformer';
import { UserDto } from 'src/identity/user/contract/dto/user.dto';

@Exclude()
export class AuthDto {
  @Expose()
  user: UserDto;

  @Expose()
  accessToken: string;
}
