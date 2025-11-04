import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApprovalWorkflow } from './approval-workflow.entity';
import { User } from 'src/identity/entity/user.entity';
import { Letter } from 'src/letter/entity/letter.entity';

@Entity()
export class Approval {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column('text', { nullable: true })
  comments: string;

  //  @ManyToOne(() => Letter, (Letter) => Letter.approvals)
  letter: Letter;

  @ManyToMany(() => ApprovalWorkflow, (en) => en.approvals)
  @JoinTable()
  workflow: ApprovalWorkflow;
}
