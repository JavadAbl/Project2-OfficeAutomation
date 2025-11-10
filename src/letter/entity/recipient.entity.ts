// Recipient.ts
import { BaseEntity } from 'src/common/entity/base.entity';
import { User } from 'src/identity/entity/user.entity';
import { Letter } from 'src/letter/entity/letter.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class Recipient extends BaseEntity {
  @ManyToOne(() => Letter, (en) => en.recipients)
  letter: Letter;

  @ManyToOne(() => User, (user) => user.recipientEntries, { nullable: true })
  user: User;
}
