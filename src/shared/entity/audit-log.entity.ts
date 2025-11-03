import { randomUUID } from 'crypto';
import { Organization } from 'src/auth/entity/organization.entity';
import { User } from 'src/auth/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('audit_logs', { synchronize: false })
export class AuditLog {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  action: string; // e.g., 'create', 'update', 'delete'

  @Column()
  resourceType: string; // e.g., 'invoice', 'payment'

  @Column()
  resourceId: string; // The UUID of the resource that was changed

  @Column({ type: 'json', nullable: true })
  jsonBefore: object; // Snapshot of the entity before the change

  @Column({ type: 'json', nullable: true })
  jsonAfter: object; // Snapshot of the entity after the change

  @CreateDateColumn()
  timestamp: Date;
}
