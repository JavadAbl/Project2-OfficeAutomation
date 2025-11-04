import { Entity, Column, ManyToMany, ManyToOne } from 'typeorm';
import { ApprovalWorkflow } from './approval-workflow.entity';
import { Letter } from 'src/letter/entity/letter.entity';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity()
export class Approval extends BaseEntity {
  @Column()
  status: number;

  @Column('text', { nullable: true })
  comment: string;

  @ManyToOne(() => Letter, (Letter) => Letter.approvals)
  letter: Letter;

  @ManyToMany(() => ApprovalWorkflow, (en) => en.approvals)
  workflow: ApprovalWorkflow;
}
