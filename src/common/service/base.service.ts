import { ConflictException, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

interface AppEntity extends ObjectLiteral {
  id: number;
}

export class BaseService<T extends AppEntity> {
  constructor(
    protected readonly rep: Repository<T>,
    private entityName,
  ) {}

  async getAndcheckExistsById(id: number): Promise<T> {
    const entity = await this.rep.findOneBy({ id } as FindOptionsWhere<T>);
    this.throwNotFoundIfFalse(entity);
    return entity!;
  }

  async getAndcheckExistsBy(field: string, value: any): Promise<T> {
    const entity = await this.rep.findOneBy({
      [field]: value,
    } as FindOptionsWhere<T>);
    this.throwNotFoundIfFalse(entity);
    return entity!;
  }

  async checkExistsById(id: number): Promise<boolean> {
    const result = await this.rep.existsBy({ id } as FindOptionsWhere<T>);
    this.throwNotFoundIfFalse(result);
    return result;
  }

  async checkExistsBy(field: string, value: any): Promise<boolean> {
    const result = await this.rep.existsBy({
      [field]: value,
    } as FindOptionsWhere<T>);
    this.throwNotFoundIfFalse(result);
    return result;
  }

  async checkConflictById(id: number): Promise<boolean> {
    const result = await this.rep.existsBy({ id } as FindOptionsWhere<T>);
    this.throwNotConflictIfTrue(result);
    return result;
  }

  async checkConflictBy(field: string, value: any): Promise<boolean> {
    const result = await this.rep.existsBy({
      [field]: value,
    } as FindOptionsWhere<T>);
    this.throwNotConflictIfTrue(result);
    return result;
  }

  private throwNotFoundIfFalse(value: any) {
    if (!value) throw new NotFoundException(`${this.entityName} is not found`);
  }

  private throwNotConflictIfTrue(value: any) {
    if (value) throw new ConflictException(`${this.entityName} already exists`);
  }
}
