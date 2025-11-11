import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentRoleService } from './department-role.service';

describe('DepartmentRoleService', () => {
  let service: DepartmentRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartmentRoleService],
    }).compile();

    service = module.get<DepartmentRoleService>(DepartmentRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
