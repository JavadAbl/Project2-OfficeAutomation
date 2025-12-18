import { Test, TestingModule } from '@nestjs/testing';
import { LetterApprovalService } from './letter-approval.service';

describe('LetterApprovalService', () => {
  let service: LetterApprovalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LetterApprovalService],
    }).compile();

    service = module.get<LetterApprovalService>(LetterApprovalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
