import { ConflictException, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { GetManyQueryRequest } from '../contract/request/get-many-query.request';
import { mapQueryToFindOptions } from '../utils/typeorm.utils';

interface AppEntity extends ObjectLiteral {
  id: number;
}

type ClassType<D> = new (...args: any[]) => D;

export class BaseService<T extends AppEntity> {
  constructor(
    protected readonly rep: Repository<T>,
    private entityName,
  ) {}

  async getById(
    id: number,
    extraOptions?: FindOneOptions<T>,
  ): Promise<T | null> {
    const entity = await this.rep.findOne({
      where: { id: id } as FindOptionsWhere<T>,
      ...extraOptions,
    });
    return entity;
  }

  async getBy(
    field: string,
    value: any,
    extraOptions?: FindOneOptions<T>,
  ): Promise<T | null> {
    const entity = await this.rep.findOne({
      where: { [field]: value } as FindOptionsWhere<T>,
      ...extraOptions,
    });
    return entity;
  }

  async getMany(
    query: GetManyQueryRequest = {},
    searchableFields?: (keyof T)[],
    extraOptions?: FindManyOptions<T>,
  ): Promise<T[]> {
    const params = mapQueryToFindOptions<T>(query, searchableFields);
    const entities = await this.rep.find({ ...params, ...extraOptions });
    return entities;
  }

  async getDtoMany<D>(
    cls: ClassType<D>,
    query?: GetManyQueryRequest,
    searchableFields?: (keyof T)[],
    extraOptions?: FindManyOptions<T>,
  ): Promise<D[]> {
    const entities = await this.getMany(query, searchableFields, extraOptions);
    return entities.map((val) => plainToInstance(cls, val, {}));
  }

  async getDtoById<D>(
    cls: ClassType<D>,
    id: number,
    extraOptions?: FindManyOptions<T>,
  ): Promise<D> {
    const object = await this.getAndCheckExistsById(id, extraOptions);
    return plainToInstance(cls, object);
  }

  async getDtoBy<D>(
    cls: ClassType<D>,
    field: string,
    value: any,
    extraOptions?: FindManyOptions<T>,
  ): Promise<D> {
    const object = await this.getAndCheckExistsBy(field, value, extraOptions);
    return plainToInstance(cls, object);
  }

  async getAndCheckExistsById(
    id: number,
    extraOptions?: FindManyOptions<T>,
  ): Promise<T> {
    const entity = await this.getById(id, extraOptions);
    this.throwNotFoundIfFalse(entity, id);
    return entity!;
  }

  async getAndCheckExistsBy(
    field: string,
    value: any,
    extraOptions?: FindManyOptions<T>,
  ): Promise<T> {
    const entity = await this.getBy(field, value, extraOptions);
    this.throwNotFoundIfFalse(entity, value);
    return entity!;
  }

  async checkExistsById(id: number): Promise<boolean> {
    const result = await this.rep.existsBy({ id } as FindOptionsWhere<T>);
    this.throwNotFoundIfFalse(result, id);
    return result;
  }

  async checkExistsBy(field: string, value: any): Promise<boolean> {
    const result = await this.rep.existsBy({
      [field]: value,
    } as FindOptionsWhere<T>);
    this.throwNotFoundIfFalse(result, value);
    return result;
  }

  async checkConflictById(id: number): Promise<boolean> {
    const result = await this.rep.existsBy({ id } as FindOptionsWhere<T>);
    this.throwNotConflictIfTrue(result, id);
    return result;
  }

  async checkConflictBy(field: string, value: any): Promise<boolean> {
    const result = await this.rep.existsBy({
      [field]: value,
    } as FindOptionsWhere<T>);
    this.throwNotConflictIfTrue(result, value);
    return result;
  }

  private throwNotFoundIfFalse(value: any, fieldValue: any) {
    if (!value)
      throw new NotFoundException(
        `${this.entityName} ${fieldValue} is not found`,
      );
  }

  private throwNotConflictIfTrue(value: any, fieldValue: any) {
    if (value)
      throw new ConflictException(
        `${this.entityName} ${fieldValue} already exists`,
      );
  }
}
