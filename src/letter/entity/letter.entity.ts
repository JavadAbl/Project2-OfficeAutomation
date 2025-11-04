import { User } from 'src/identity/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Template } from './template.entity';
import { Recipient } from 'src/letter/entity/recipient.entity';
import { Attachment } from './attachment.entity';
import { Approval } from 'src/workflow/entity/approval.entity';

@Entity({ synchronize: false })
export class Letter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column('text')
  body: string;

  @Column()
  type: string;

  @Column()
  status: string;

  @Column()
  priority: string;

  @Column({ type: 'datetime' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.createdLetters)
  creatorUser: User;

  @ManyToOne(() => Template, (template) => template.letters)
  template: Template;

  @OneToMany(() => Recipient, (recipient) => recipient.letter)
  recipients: Recipient[];

  @OneToMany(() => Attachment, (attachment) => attachment.letter)
  attachments: Attachment[];

  @OneToMany(() => Approval, (approval) => approval.letter)
  approvals: Approval[];
}
