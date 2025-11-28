import { type IGeneratedQuery } from "@common/generateQuery";
import { ITodoRepository } from "@core/ITodoRepository";
import { Todo } from "@domain/Todo";

export class InMemoryTodoRepository implements ITodoRepository {
  private todos: Todo[] = [];
  private idCounter: number = 0;

  async create(todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
    // Reasonable ID generation, use increment to guarantee generate uniqe id.
    this.idCounter++;
    const id = `todo-${this.idCounter}`;
    const now = new Date();

    const todo: Todo = {
      ...todoData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.todos.push(todo);
    return todo;
  }

  async update(id: string, updates: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt'>>): Promise<Todo | null> {
    const index = this.todos.findIndex((t) => t.id === id);

    // Not silently create new entities on unknown IDs,
    // Return null if todo not found
    if (index === -1) {
      return null
    }

    this.todos[index] = {
      ...this.todos[index],
      ...updates,
      updatedAt: new Date(),
    };

    return this.todos[index];
  }

  async findById(id: string): Promise<Todo | null> {
    const todo = this.todos.find((t) => t.id === id);
    return todo || null;
  }

  async findByUserId(userId: string, queryPagination: IGeneratedQuery): Promise<{ data: Todo[]; count: number; }> {
    // Generated Pagination
    const { skip, take } = queryPagination;

    const data = this.todos
      // Filter todos by userId
      .filter((todo) => todo.userId === userId)
      // skip based on page
      .slice(skip, skip + take);

    // Count all todos data
    const count = data.length;

    return {
      data,
      count
    };
  }

  async findDueReminders(currentTime: Date): Promise<Todo[]> {
    // Add another condition to check is status is PENDING
    return this.todos.filter((t) => t.remindAt && t.remindAt <= currentTime && t.status === 'PENDING');
  }
}
