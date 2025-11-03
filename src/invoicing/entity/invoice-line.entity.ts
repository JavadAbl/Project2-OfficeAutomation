import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Invoice } from './invoice.entity';
import { randomUUID } from 'crypto';
import { Account } from 'src/general-ledger/entity/account.entity';

@Entity('invoice_lines', { synchronize: false })
export class InvoiceLine {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @ManyToOne(() => Invoice, (invoice) => invoice.lines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column()
  description: string;

  @Column({ type: 'decimal' })
  quantity: number;

  @Column({ type: 'bigint' })
  unitPriceCents: string;

  @Column({ type: 'decimal' })
  taxRate: number;

  @Column({ type: 'bigint' })
  lineTotalCents: string;

  @ManyToOne(() => Account, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'account_id' })
  account: Account; // The revenue account for this line item
}
