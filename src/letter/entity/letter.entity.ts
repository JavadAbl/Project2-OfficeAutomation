import { User } from 'src/identity/entity/user.entity';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Template } from './template.entity';
import { Recipient } from 'src/letter/entity/recipient.entity';
import { Attachment } from './attachment.entity';
import { LetterApproval } from 'src/letter/entity/letter-approval.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { LetterStatus } from '../contract/enum/letter-status.enum';
import { LetterPriority } from '../contract/enum/letter-priority.enum';

@Entity({ synchronize: true })
export class Letter extends BaseEntity {
  @Column({ unique: true })
  number: string;

  @Column({ nullable: true })
  subject: string;

  @Column({ nullable: true })
  body: string;

  @Column({ default: LetterStatus.draft, enum: LetterStatus })
  status: LetterStatus;

  @Column({ default: LetterPriority.Normal, enum: LetterPriority })
  priority: LetterPriority;

  @ManyToOne(() => User, (user) => user.createdLetters, { nullable: true })
  creatorUser: User;

  @ManyToOne(() => Template, (template) => template.letters)
  @JoinColumn({ name: 'templateId' })
  template: Template;
  @Column({ nullable: true })
  templateId: number;

  @OneToMany(() => Recipient, (recipient) => recipient.letter)
  recipients: Recipient[];

  @OneToMany(() => Attachment, (attachment) => attachment.letter)
  attachments: Attachment[];

  @OneToMany(() => LetterApproval, (approval) => approval.letter)
  letterApprovals: LetterApproval[];
}
