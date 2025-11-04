// Recipient.ts
import { User } from 'src/identity/entity/user.entity';
import { Letter } from 'src/letter/entity/letter.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Recipient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  recipient_address: string;

  @ManyToOne(() => Letter, (en) => en.recipients)
  letter: Letter;

  @ManyToOne(() => User, (user) => user.recipientEntries, { nullable: true })
  user: User;
}
