export interface IGeneratedQuery {
  skip: number;
  take: number;
  whereClause?: Record<string, any>;
  orderClause?: Record<string, 'asc' | 'desc'>;
}

export function generateQuery(dto: Record<string, any>): IGeneratedQuery {
  // Pagination
  const limit = dto.limit ?? 10;
  const page = dto.page ?? 1;

  const take = limit;
  const skip = (page - 1) * limit;

  const result: IGeneratedQuery = { skip, take };

  // Search (dynamic)
  if (dto.searchVal && dto.searchBy) {
    result.whereClause = {
      [dto.searchBy]: {
        contains: dto.searchVal,
        mode: 'insensitive',
      },
    };
  }

  // Sorting (dynamic)
  if (dto.sortBy) {
    const sortDirection = dto.sortVal?.toLowerCase() === 'desc' ? 'desc' : 'asc';

    result.orderClause = {
      [dto.sortBy]: sortDirection,
    };
  }

  return result;
}
