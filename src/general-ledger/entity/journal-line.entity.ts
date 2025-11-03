import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Account } from './account.entity';
import { randomUUID } from 'crypto';
import { JournalEntry } from './journal-entry.entity';

@Entity('journal_lines', { synchronize: false })
export class JournalLine {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @ManyToOne(() => JournalEntry, (entry) => entry.lines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'journal_entry_id' })
  journalEntry: JournalEntry;

  @ManyToOne(() => Account, (account) => account.journalLines, {
    onDelete: 'RESTRICT',
  }) // Prevent deleting an account used in a journal line
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ type: 'bigint' })
  amountCents: string; // Using string for bigint is a best practice in JS/TS to handle large numbers safely.

  @Column()
  currency: string;

  @Column({ nullable: true })
  memo: string;
}
