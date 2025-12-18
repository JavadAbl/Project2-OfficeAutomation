import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { User } from 'src/identity/user/_user/entity/user.entity';
import { Letter } from 'src/letter/_letter/entity/letter.entity';

@Entity()
export class LetterAction extends BaseEntity {
  @Column()
  action: string;

  @Column()
  password: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  sender: User;

  @Column({ nullable: false })
  senderId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @Column({ nullable: true })
  receiverId: number;

  @ManyToOne(() => Letter, { nullable: false })
  @JoinColumn({ name: 'letterId' })
  letter: Letter;

  @Column({ nullable: false })
  letterId: number;
}
