import { Test, TestingModule } from '@nestjs/testing';
import { ApprovalWorkflowRoleService } from './approval-workflow-role.service';

describe('ApprovalWorkflowRoleService', () => {
  let service: ApprovalWorkflowRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApprovalWorkflowRoleService],
    }).compile();

    service = module.get<ApprovalWorkflowRoleService>(ApprovalWorkflowRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
