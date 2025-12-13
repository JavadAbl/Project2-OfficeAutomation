import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Letter } from 'src/letter/entity/letter.entity';
import { Recipient } from 'src/letter/recipient/entity/recipient.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { DepartmentRole } from 'src/identity/department/entity/department-role.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true, nullable: false })
  username: string;

  @Column()
  password: string;

  @ManyToOne(() => DepartmentRole, (entity) => entity.users, { nullable: true })
  @JoinColumn({ name: 'departmentRoleId' })
  departmentRole: DepartmentRole | null;

  @Column({ nullable: true })
  departmentRoleId: number | null;

  @OneToMany(() => Letter, (Letter) => Letter.creatorUser)
  createdLetters: Letter[];

  @OneToMany(() => Recipient, (recipient) => recipient.user)
  recipientEntries: Recipient[];
}
