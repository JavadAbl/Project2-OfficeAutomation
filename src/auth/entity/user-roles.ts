import { randomUUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_roles', { synchronize: true })
export class UserRoles {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @Column({ unique: true, nullable: false })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (entity) => entity.role)
  user: User;
}
