import { Organization } from 'src/auth/entity/organization.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { randomUUID } from 'crypto';

@Entity('chart_of_accounts', { synchronize: false })
export class ChartOfAccounts {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @ManyToOne(
    () => Organization,
    (organization) => organization.chartOfAccounts,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column()
  name: string;

  @Column()
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  // Relationships
  @OneToMany(() => Account, (account) => account.chartOfAccounts)
  accounts: Account[];
}
