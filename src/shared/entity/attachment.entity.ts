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

@Entity('attachments', { synchronize: false })
export class Attachment {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column()
  // Polymorphic type: e.g., 'invoice', 'payment', 'journal_entry'
  attachedToType: string;

  @Column()
  // Polymorphic ID: The UUID of the entity this attachment belongs to
  attachedToId: string;

  @Column()
  storageKey: string; // e.g., the path in S3, Google Cloud Storage, etc.

  @Column()
  filename: string;

  @Column()
  contentType: string; // e.g., 'image/jpeg', 'application/pdf'

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by_user_id' })
  uploadedByUser: User;

  @CreateDateColumn()
  createdAt: Date;
}
