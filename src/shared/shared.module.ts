import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AuditLogService } from './audit-log.service';
import { CurrencyRateService } from './currency-rate.service';

@Module({
  providers: [AttachmentService, AuditLogService, CurrencyRateService]
})
export class SharedModule {}
