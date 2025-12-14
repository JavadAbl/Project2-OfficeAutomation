import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Template } from '../template/entity/template.entity';
import { Recipient } from 'src/letter/recipient/entity/recipient.entity';
import { Attachment } from './attachment.entity';
import { LetterApproval } from 'src/letter/entity/letter-approval.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { LetterStatus } from '../contract/enum/letter-status.enum';
import { LetterPriority } from '../contract/enum/letter-priority.enum';
import { User } from 'src/identity/user/entity/user.entity';

@Entity({ synchronize: true })
export class Letter extends BaseEntity {
  @Column({ unique: true })
  number: string;

  @Column()
  subject: string;

  @Column({ nullable: true })
  body: string;

  @Column({ default: LetterStatus.draft, enum: LetterStatus })
  status: LetterStatus;

  @Column({ default: LetterPriority.Normal, enum: LetterPriority })
  priority: LetterPriority;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'creatorUserId' })
  creatorUser: User;

  @Column({ nullable: false })
  creatorUserId: number;

  @ManyToOne(() => Template, { nullable: false })
  @JoinColumn({ name: 'templateId' })
  template: Template;

  @Column({ nullable: false })
  templateId: number;

  @OneToMany(() => Recipient, (recipient) => recipient.letter)
  recipients: Recipient[];

  @OneToMany(() => Attachment, (attachment) => attachment.letter)
  attachments: Attachment[];

  @OneToMany(() => LetterApproval, (approval) => approval.letter)
  letterApprovals: LetterApproval[];
}
