import type { IQueryPagination } from "@common/paginations";
import { Todo } from "../domain/Todo";

export interface ITodoRepository {
  create(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo>;
  update(id: string, updates: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt'>>): Promise<Todo | null>;
  findById(id: string): Promise<Todo | null>;

  /**
   * Find todos for a specific user with pagination.
   *
   * @param userId - ID of the user to search todos for
   * @param pagination - Pagination options (page, limit, offset)
   *
   * @returns An object containing:
   *   - data: Array of todos
   *   - count: Total number of todos for the user
   *
   */
  findByUserId(userId: string, queryPagination: IQueryPagination): Promise<{ data: Todo[]; count: number; }>;

  findDueReminders(currentTime: Date): Promise<Todo[]>;
}
