import { randomUUID } from 'crypto';
import { Organization } from 'src/auth/entity/organization.entity';
import { User } from 'src/auth/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { ReconciliationItem } from './reconciliation-item.entity';

@Entity('reconciliation_records', { synchronize: false })
export class ReconciliationRecord {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  @Column({ type: 'timestamp' })
  reconciledAt: Date;

  @Column({ type: 'date' })
  periodStart: Date;

  @Column({ type: 'date' })
  periodEnd: Date;

  // Relationships
  @OneToMany(() => ReconciliationItem, (item) => item.reconciliationRecord, {
    cascade: true,
  })
  items: ReconciliationItem[];
}
