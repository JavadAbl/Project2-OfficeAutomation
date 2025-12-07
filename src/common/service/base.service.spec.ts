/* eslint-disable @typescript-eslint/unbound-method */
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Exclude, Expose } from 'class-transformer';
import { Entity, Repository } from 'typeorm';
import { GetManyQueryRequest } from '../contract/request/get-many-query.request';
import { BaseService } from './base.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

// Mock entity for testing
@Entity()
class TestEntity {
  id: number;
  name: string;
  email: string;
}

// DTO class for transformation tests
@Exclude()
class TestDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
}

describe('BaseService', () => {
  let service: BaseService<TestEntity>;
  let repository: jest.Mocked<Repository<TestEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BaseService,
          useFactory: (repo: Repository<TestEntity>) =>
            new BaseService(repo, 'TestEntity'),
          inject: [getRepositoryToken(TestEntity)],
        },
        {
          provide: getRepositoryToken(TestEntity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            existsBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(BaseService);
    repository = module.get(getRepositoryToken(TestEntity));
  });

  describe('getById', () => {
    it('should return entity when found', async () => {
      const mockEntity = { id: 1, name: 'Test' } as TestEntity;
      repository.findOne.mockResolvedValue(mockEntity);

      const result = await service.getById(1);

      expect(result).toEqual(mockEntity);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null when not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.getById(999);

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });

    it('should pass extra options to repository', async () => {
      const mockEntity = { id: 1, name: 'Test' } as TestEntity;
      repository.findOne.mockResolvedValue(mockEntity);

      await service.getById(1, { relations: ['profile'] });

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['profile'],
      });
    });
  });

  describe('getBy', () => {
    it('should return entity when found by field', async () => {
      const mockEntity = { id: 1, email: 'test@example.com' } as TestEntity;
      repository.findOne.mockResolvedValue(mockEntity);

      const result = await service.getBy('email', 'test@example.com');

      expect(result).toEqual(mockEntity);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null when not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.getBy('email', 'notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('getMany', () => {
    it('should return entities with default query', async () => {
      const mockEntities = [{ id: 1 }, { id: 2 }] as TestEntity[];
      repository.find.mockResolvedValue(mockEntities);
      jest
        .spyOn(require('../utils/typeorm.utils'), 'mapQueryToFindOptions')
        .mockReturnValue({ where: {}, take: 10 });

      const result = await service.getMany();

      expect(result).toEqual(mockEntities);
      expect(repository.find).toHaveBeenCalledWith({
        where: {},
        take: 10,
      });
    });

    it('should apply searchable fields', async () => {
      const mockEntities = [{ id: 1 }] as TestEntity[];
      repository.find.mockResolvedValue(mockEntities);
      const mapSpy = jest.spyOn(
        require('../utils/typeorm.utils'),
        'mapQueryToFindOptions',
      );

      await service.getMany({}, ['name', 'email']);

      expect(mapSpy).toHaveBeenCalledWith({}, ['name', 'email']);
    });

    it('should merge extra options', async () => {
      const mockEntities = [{ id: 1 }] as TestEntity[];
      repository.find.mockResolvedValue(mockEntities);

      await service.getMany({}, undefined, { order: { id: 'DESC' } });

      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          order: { id: 'DESC' },
        }),
      );
    });
  });

  describe('DTO Transformation Methods', () => {
    it('getDtoById should transform entity to DTO', async () => {
      const mockEntity = { id: 1, name: 'Test', email: 'test@example.com' };
      repository.findOne.mockResolvedValue(mockEntity);

      const result = await service.getDtoById(TestDto, 1);

      expect(result).toBeInstanceOf(TestDto);
      expect(result).toEqual({ id: 1, name: 'Test' });
    });

    it('getDtoBy should throw NotFoundException when not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.getDtoBy(TestDto, 'email', 'notfound@example.com'),
      ).rejects.toThrow(NotFoundException);
    });

    it('getDtoMany should transform multiple entities', async () => {
      const mockEntities = [
        { id: 1, name: 'Test1', email: '1@example.com' },
        { id: 2, name: 'Test2', email: '2@example.com' },
      ];
      repository.find.mockResolvedValue(mockEntities);

      const result = await service.getDtoMany(TestDto, {});

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(TestDto);
      expect(result[0]).toEqual({ id: 1, name: 'Test1' });
    });
  });

  describe('Existence Checks', () => {
    describe('getAndCheckExists', () => {
      it('should return entity when exists', async () => {
        const mockEntity = { id: 1 } as TestEntity;
        repository.findOne.mockResolvedValue(mockEntity);

        const result = await service.getAndCheckExistsById(1);

        expect(result).toEqual(mockEntity);
      });

      it('should throw NotFoundException when not found by ID', async () => {
        repository.findOne.mockResolvedValue(null);

        await expect(service.getAndCheckExistsById(999)).rejects.toThrow(
          NotFoundException,
        );
        await expect(service.getAndCheckExistsById(999)).rejects.toThrow(
          'TestEntity 999 is not found',
        );
      });

      it('should throw NotFoundException when not found by field', async () => {
        repository.findOne.mockResolvedValue(null);

        await expect(
          service.getAndCheckExistsBy('email', 'missing@example.com'),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('checkExists', () => {
      it('should return true when exists', async () => {
        repository.existsBy.mockResolvedValue(true);

        const result = await service.checkExistsById(1);

        expect(result).toBe(true);
      });

      it('should throw NotFoundException when not exists', async () => {
        repository.existsBy.mockResolvedValue(false);

        await expect(service.checkExistsById(999)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('checkConflict', () => {
      it('should throw ConflictException when exists', async () => {
        repository.existsBy.mockResolvedValue(true);

        await expect(
          service.checkConflictBy('email', 'existing@example.com'),
        ).rejects.toThrow(ConflictException);
        await expect(
          service.checkConflictBy('email', 'existing@example.com'),
        ).rejects.toThrow('TestEntity existing@example.com already exists');
      });

      it('should return false when no conflict', async () => {
        repository.existsBy.mockResolvedValue(false);

        const result = await service.checkConflictById(999);

        expect(result).toBe(false);
      });
    });
  });

  describe('Error Messages', () => {
    it('should include entity name in not found errors', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.getAndCheckExistsById(1)).rejects.toThrow(
        'TestEntity 1 is not found',
      );
    });

    it('should include entity name in conflict errors', async () => {
      repository.existsBy.mockResolvedValue(true);

      await expect(
        service.checkConflictBy('email', 'test@example.com'),
      ).rejects.toThrow('TestEntity test@example.com already exists');
    });
  });

  describe('Integration with mapQueryToFindOptions', () => {
    it('should correctly pass query parameters to mapping util', async () => {
      const mockQuery: GetManyQueryRequest = {
        page: 2,
        pageSize: 5,
        search: 'test',
        sortBy: 'name',
        sortOrder: 'asc',
      };
      const mockOptions = {
        where: { name: 'test' },
        skip: 5,
        take: 5,
        order: { name: 'asc' },
      };

      jest
        .spyOn(require('../utils/typeorm.utils'), 'mapQueryToFindOptions')
        .mockReturnValue(mockOptions as any);
      repository.find.mockResolvedValue([]);

      await service.getMany(mockQuery, ['name']);

      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { name: 'test' },
          skip: 5,
          take: 5,
          order: { name: 'asc' },
        }),
      );
    });
  });
});
