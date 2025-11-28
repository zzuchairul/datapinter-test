import { generateQuery } from '@common/generateQuery';
import { ApiError } from '@common/httpErrors';
import { Todo } from '@domain/Todo';
import { CreateTodoDTO } from '@dto/CreateTodoDTO';
import type { GetTodoListDTO } from '@dto/GetTodoListDTO';
import { ITodoRepository } from './ITodoRepository';
import { IUserRepository } from './IUserRepository';

export class TodoService {
  constructor(private todoRepo: ITodoRepository, private userRepo: IUserRepository) {}

  // Change data input type from any to CreateTodoDTO
  async createTodo(data: CreateTodoDTO & { userId: string }): Promise<Todo> {
    // Check if title empty or only contain white-space
    if (!data.title.trim()) {
      throw new ApiError('BAD_REQUEST', 'title field is required');
    }
    
    // Check is userId is an exist user
    const user = await this.userRepo.findById(data.userId);
    if (!user) {
      throw new ApiError('NOT_FOUND', `User with id ${data.userId} not found`);
    }

    const todo = await this.todoRepo.create({
      userId: data.userId,
      title: data.title,
      description: data.description ?? undefined,
      status: 'PENDING',
      remindAt: data.remindAt ? new Date(data.remindAt) : undefined,
    });

    return todo;
  }

  async completeTodo(todoId: string): Promise<Todo> {
    // Check if todo is exist.
    const todo = await this.todoRepo.findById(todoId);

    if (!todo) {
      throw new ApiError('NOT_FOUND', `Todo with id ${todoId} not found`);
    }

    // If status already DONE, return it.
    if (todo.status === 'DONE') {
      return todo;
    }

    const updated = await this.todoRepo.update(todoId, {
      status: 'DONE',
      // NOTE: It's better not to manually set updatedAt since it's automatically updated in InMemoryTodoRepo and PrismaTodoRepo
      // updatedAt: new Date()
    });

    if (!updated) {
      throw new ApiError('INTERNAL_ERROR', 'Something went wrong');
    }

    return updated;
  }

  async getTodosByUser(userId: string, query: GetTodoListDTO): Promise<{ data: Todo[]; count: number }> {
    // Generate query for pagination
    const queryPagination = generateQuery(query);

    return this.todoRepo.findByUserId(userId, queryPagination);
  }

  async processReminders(): Promise<void> {
    const now = new Date();
    const dueTodos = await this.todoRepo.findDueReminders(now);

    for (const todo of dueTodos) {
      // This should only process PENDING todos, but doesn't check
      if (todo.status === 'DONE') continue;

      await this.todoRepo.update(todo.id, {
        status: 'REMINDER_DUE',
        // NOTE: It's better not to manually set updatedAt since it's automatically updated in InMemoryTodoRepo and PrismaTodoRepo
        // updatedAt: new Date(),
      });
    }
  }
}
