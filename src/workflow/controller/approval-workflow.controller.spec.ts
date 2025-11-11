import { Test, TestingModule } from '@nestjs/testing';
import { ApprovalWorkflowController } from './approval-workflow.controller';

describe('ApprovalWorkflowController', () => {
  let controller: ApprovalWorkflowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApprovalWorkflowController],
    }).compile();

    controller = module.get<ApprovalWorkflowController>(ApprovalWorkflowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
