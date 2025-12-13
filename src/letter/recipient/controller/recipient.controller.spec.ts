import { Test, TestingModule } from '@nestjs/testing';
import { RecipientController } from './recipient.controller';

describe('RecipientController', () => {
  let controller: RecipientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipientController],
    }).compile();

    controller = module.get<RecipientController>(RecipientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
