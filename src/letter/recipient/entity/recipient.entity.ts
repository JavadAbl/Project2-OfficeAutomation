// Recipient.ts
import { BaseEntity } from 'src/common/entity/base.entity';
import { User } from 'src/identity/user/entity/user.entity';
import { Letter } from 'src/letter/entity/letter.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Recipient extends BaseEntity {
  @ManyToOne(() => Letter, (en) => en.recipients)
  @JoinColumn({ name: 'letterId' })
  letter: Letter;
  @Column()
  letterId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'receiverId' })
  receiver: User;
  @Column()
  receiverId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'senderId' })
  sender: User;
  @Column()
  senderId: number;

  @Column({ default: false })
  IsSeen: boolean;
}
