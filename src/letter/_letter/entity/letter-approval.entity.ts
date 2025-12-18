import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Letter } from 'src/letter/_letter/entity/letter.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { DepartmentRole } from 'src/identity/department/_department/entity/department-role.entity';

@Entity()
export class LetterApproval extends BaseEntity {
  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isRejected: boolean;

  @ManyToOne(() => Letter, (Letter) => Letter.letterApprovals, { nullable: false })
  @JoinColumn({ name: 'letterId' })
  letter: Letter;

  @Column({ nullable: false })
  letterId: number;

  @ManyToOne(() => DepartmentRole, { nullable: false })
  @JoinColumn({ name: 'departmentRoleId' })
  departmentRole: DepartmentRole;

  @Column({ nullable: false })
  departmentRoleId: number;
}
