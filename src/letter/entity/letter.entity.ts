import { User } from 'src/identity/entity/user.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Template } from './template.entity';
import { Recipient } from 'src/letter/entity/recipient.entity';
import { Attachment } from './attachment.entity';
import { Approval } from 'src/workflow/entity/approval.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { LetterStatus } from '../contract/enum/letter-status.enum';

@Entity({ synchronize: true })
export class Letter extends BaseEntity {
  @Column()
  subject: string;

  @Column()
  body: string;

  @Column({ default: LetterStatus.draft, enum: LetterStatus })
  status: LetterStatus;

  @Column()
  priority: string;

  @ManyToOne(() => User, (user) => user.createdLetters, { nullable: true })
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
