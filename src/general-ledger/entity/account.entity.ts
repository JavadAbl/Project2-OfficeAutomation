import { randomUUID } from 'crypto';
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
import { JournalLine } from './journal-line.entity';
import { ChartOfAccounts } from './chart_of_accounts';

@Entity('accounts', { synchronize: false })
export class Account {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @ManyToOne(() => Organization, (organization) => organization.accounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => ChartOfAccounts, (coa) => coa.accounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'coa_id' })
  chartOfAccounts: ChartOfAccounts;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column()
  type: string; // e.g., 'asset', 'liability', 'equity', 'revenue', 'expense'

  @Column()
  normalBalance: string; // 'debit' or 'credit'

  @Column()
  currency: string;

  @Column({ default: false })
  isSystemAccount: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // Relationships
  @OneToMany(() => JournalLine, (line) => line.account)
  journalLines: JournalLine[];
}
