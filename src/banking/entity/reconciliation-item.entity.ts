import { randomUUID } from 'crypto';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ReconciliationRecord } from './reconciliation-record.entity';

@Entity('reconciliation_items', { synchronize: false })
export class ReconciliationItem {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @ManyToOne(() => ReconciliationRecord, (record) => record.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reconciliation_record_id' })
  reconciliationRecord: ReconciliationRecord;

  @Column()
  // Polymorphic type: e.g., 'payment', 'bank_transaction'
  itemType: string;

  @Column()
  // Polymorphic ID: The UUID of the corresponding item
  itemId: string;
}
