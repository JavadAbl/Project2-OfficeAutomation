import { randomUUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { UserRoles } from './user-roles';

@Entity('users', { synchronize: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid', {
    // generated: 'uuid',
    unique: true,
  })
  uuid: string = randomUUID();

  @Column({ unique: true, nullable: false })
  username: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Organization, (entity) => entity.users, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => UserRoles, (entity) => entity.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: UserRoles;
}
