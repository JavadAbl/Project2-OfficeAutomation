import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Letter } from 'src/letter/entity/letter.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { LetterApprovalStatus } from '../contract/enum/letter-approval-status.enum';

@Entity()
export class LetterApproval extends BaseEntity {
  @Column({
    enum: LetterApprovalStatus,
    default: LetterApprovalStatus.pending,
  })
  status: LetterApprovalStatus;

  @ManyToOne(() => Letter, (Letter) => Letter.letterApprovals, {
    nullable: false,
  })
  @JoinColumn({ name: 'letterId' })
  letter: Letter;

  @Column({ nullable: false })
  letterId: number;
}
