import { Test, TestingModule } from '@nestjs/testing';
import { BCryptProvider } from './bcrypt.provider';

describe('BCryptProvider', () => {
  let provider: BCryptProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BCryptProvider],
    }).compile();

    provider = module.get<BCryptProvider>(BCryptProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
