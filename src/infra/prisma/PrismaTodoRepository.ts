import { type IGeneratedQuery } from '@common/generateQuery';
import type { ITodoRepository } from '@core/ITodoRepository';
import type { Todo } from '@domain/Todo';
import { prisma } from './client';

export class PrismaTodoRepository implements ITodoRepository {
  async create(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
    // Create todo
    const created = await prisma.todo.create({ data: todo });
    return {
      ...created,
      description: created.description ?? undefined,
      remindAt: created.remindAt ?? undefined,
    };
  }

  async update(id: string, updates: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Todo | null> {
    // Update todo
    const updated = await prisma.todo.update({
      where: { id },
      data: updates,
    });
    return {
      ...updated,
      description: updated.description ?? undefined,
      remindAt: updated.remindAt ?? undefined,
    };
  }

  async findById(id: string): Promise<Todo | null> {
    const todo = await prisma.todo.findUnique({
      where: { id },
    });
    return todo
      ? {
          ...todo,
          description: todo.description ?? undefined,
          remindAt: todo.remindAt ?? undefined,
        }
      : null;
  }

  async findByUserId(userId: string, query: IGeneratedQuery): Promise<{ data: Todo[]; count: number; }> {
    // Generated pagination
    // Promise to run query synchronous
    const [todos, todosCount] = await Promise.all([
      // Get todos by userId
      prisma.todo.findMany({
        skip: query.skip,
        take: query.take,
        where: {
          ...query.whereClause,
          userId,
        },
        orderBy: query.orderClause,
      }),
      // Get all todos count
      prisma.todo.count({
        where: {
          ...query.whereClause,
          userId,
        },
      }),
    ]);

    return {
      data: todos.map((todo) => ({
        ...todo,
        description: todo.description ?? undefined,
        remindAt: todo.remindAt ?? undefined,
      })),
      count: todosCount,
    };
  }

  async findDueReminders(currentTime: Date): Promise<Todo[]> {
    const todos = await prisma.todo.findMany({
      // Filter only PENDING todos with remindAt <= now
      where: {
        status: {
          equals: 'PENDING'
        },
        remindAt: {
          lte: currentTime,
        },
      },
    });

    return todos.map((todo) => ({
      ...todo,
      description: todo.description ?? undefined,
      remindAt: todo.remindAt ?? undefined,
    }));
  }
}