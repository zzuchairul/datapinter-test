export interface IPagination {
  limit: number;
  page: number;
}

export interface IQueryPagination {
  skip: number;
  take: number;
}

export function generateQueryPagination(pagination: IPagination): IQueryPagination {
  const { limit, page } = pagination;

  const skip = (page - 1) * limit;
	const take = limit;
  
  return { 
    take, 
    skip 
  }
}