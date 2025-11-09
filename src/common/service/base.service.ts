import { NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

interface AppEntity extends ObjectLiteral {
  id: number;
}

export class BaseService<T extends AppEntity> {
  constructor(
    protected readonly rep: Repository<T>,
    private entityName,
  ) {}

  async getAndCheckById(id: number): Promise<T> {
    const entity = await this.rep.findOneBy({ id } as FindOptionsWhere<T>);
    this.throwNotFountIfFalsy(entity);
    return entity!;
  }

  async getAndCheckBy(field: string, value: any): Promise<T> {
    const entity = await this.rep.findOneBy({
      [field]: value,
    } as FindOptionsWhere<T>);
    this.throwNotFountIfFalsy(entity);
    return entity!;
  }

  async checkById(id: number): Promise<boolean> {
    const result = await this.rep.existsBy({ id } as FindOptionsWhere<T>);
    this.throwNotFountIfFalsy(result);
    return result;
  }

  async checkBy(field: string, value: any): Promise<boolean> {
    const result = await this.rep.existsBy({
      [field]: value,
    } as FindOptionsWhere<T>);
    this.throwNotFountIfFalsy(result);
    return result;
  }

  private throwNotFountIfFalsy(value: any) {
    if (!value) throw new NotFoundException(`${this.entityName} is not found`);
  }
}
