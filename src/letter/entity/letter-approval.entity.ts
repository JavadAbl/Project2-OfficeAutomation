import {
  Entity,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { ApprovalWorkflow } from '../../workflow/entity/approval-workflow.entity';
import { Letter } from 'src/letter/entity/letter.entity';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity()
export class LetterApproval extends BaseEntity {
  @Column()
  status: number;

  @ManyToOne(() => Letter, (Letter) => Letter.letterApprovals)
  @JoinColumn({ name: 'letterId' })
  letter: Letter;

  @Column({ nullable: true })
  letterId: number;

  @ManyToMany(() => ApprovalWorkflow, (en) => en.letterApprovals)
  @JoinTable()
  workflow: ApprovalWorkflow;
}
