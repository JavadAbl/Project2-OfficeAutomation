import { Organization } from 'src/auth/entity/organization.entity';
import { User } from 'src/auth/entity/user.entity';
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
import { randomUUID } from 'crypto';

@Entity('journal_entries', { synchronize: false })
export class JournalEntry {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @ManyToOne(
    () => Organization,
    (organization) => organization.journalEntries,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  @Column({ type: 'timestamp' })
  occurredAt: Date;

  @Column()
  description: string;

  @Column({ nullable: true })
  sourceType: string;

  @Column({ nullable: true })
  sourceId: string;

  @Column({ default: false })
  posted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // Relationships
  @OneToMany(() => JournalLine, (line) => line.journalEntry, { cascade: true })
  lines: JournalLine[];
}
