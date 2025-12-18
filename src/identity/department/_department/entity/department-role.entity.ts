import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Department } from './department.entity';
import { AuthRole } from 'src/auth/_auth/enum/auth-role.enum';

@Entity()
export class DepartmentRole extends BaseEntity {
  @Column({ unique: true, nullable: false })
  name: string;

  @ManyToOne(() => Department, (en) => en.departmentRoles, { nullable: false })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ nullable: false })
  departmentId: number;

  @Column({ nullable: false, enum: AuthRole })
  authRole: AuthRole;
}
