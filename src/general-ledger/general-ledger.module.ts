import { Module } from '@nestjs/common';
import { JournalEntryService } from './journal-entry.service';
import { AccountService } from './account.service';

@Module({
  providers: [JournalEntryService, AccountService]
})
export class GeneralLedgerModule {}
