
import { PAGINATION } from '@/common/constants';

export interface PaginationOptions {
page?: number;
limit?: number;
}

export interface PaginationResult<T> {
data: T[];
meta: {
total: number;
page: number;
limit: number;
totalPages: number;
hasNextPage: boolean;
hasPreviousPage: boolean;
};
}

/**
    * Pagination Helper
    *
    * @description
    * Utility functions for handling pagination.
    */
export class PaginationHelper {
    /**
    * Validate and normalize pagination options
    */
  static validateOptions(options: PaginationOptions): Required<PaginationOptions> {
    const page = Math.max(1, options.page || PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(
  Math.max(1, options.limit || PAGINATION.DEFAULT_LIMIT),
  PAGINATION.MAX_LIMIT,
      );

    return { page, limit };
}

/**
      * Calculate skip value for database queries
      */
static getSkip(page: number, limit: number): number {
return (page - 1) * limit;
}

/**
      * Build pagination result
      */
static buildResult<T>(
data: T[],
total: number,
page: number,
limit: number,
): PaginationResult<T> {
const totalPages = Math.ceil(total / limit);

return {
data,
meta: {
total,
page,
limit,
totalPages,
hasNextPage: page < totalPages, hasPreviousPage: page> 1,
},
};
}
}
