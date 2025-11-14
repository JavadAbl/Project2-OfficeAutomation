/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FindManyOptions, Like } from 'typeorm';
import { GetManyQueryRequest } from '../contract/request/get-many-query.request';

export function mapQueryToFindOptions<T>(
  query: GetManyQueryRequest,
  searchableFields: (keyof T)[] = [],
): FindManyOptions<T> {
  if (!query || Object.keys(query)?.length === 0) return {};

  const {
    page = 1,
    pageSize = 10,
    sortBy = 'id',
    sortOrder = 'asc',
    search,
  } = query;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const order: any = sortBy ? { [sortBy]: sortOrder.toUpperCase() } : undefined;

  let where: any = undefined;
  if (search && searchableFields.length > 0) {
    // Build OR conditions for search
    where = searchableFields.map((field) => ({
      [field]: Like(`%${search}%`),
    }));
  }

  return {
    skip,
    take,
    order,
    where,
  };
}
