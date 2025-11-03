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
import { Account } from 'src/general-ledger/entity/account.entity';
import { JournalEntry } from 'src/general-ledger/entity/journal-entry.entity';
import { ChartOfAccounts } from 'src/general-ledger/entity/chart_of_accounts';
import { Vendor } from 'src/contacts/entity/vendor.entity';

@Entity('organizations', { synchronize: true })
export class Organization {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @Column({ unique: true, nullable: false })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  // @OneToMany(() => ChartOfAccounts, (coa) => coa.organization)
  chartOfAccounts: ChartOfAccounts[];

  // @OneToMany(() => Account, (account) => account.organization)
  accounts: Account[];

  //  @OneToMany(() => JournalEntry, (entry) => entry.organization)
  journalEntries: JournalEntry[];

  //  @OneToMany(() => Vendor, (entry) => entry.organization)
  vendors: Vendor[];
}
