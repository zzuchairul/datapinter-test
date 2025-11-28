import type { IGeneratedQuery } from "@common/generateQuery";
import { IUserRepository } from "../core/IUserRepository";
import { User } from "../domain/User";

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];
  private idCounter = 0;

  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    this.idCounter++;
    const user: User = {
      ...userData,
      id: `user-${this.idCounter}`,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id == id);
    return user || null;
  }

  async findAll(_query: IGeneratedQuery): Promise<{ data: User[]; count: number }> {
    return {
      data: this.users,
      count: this.users.length
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);
    return user ?? null;
  }

  async update(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    const index = this.users.findIndex((t) => t.id === id);

    this.users[index] = {
      ...this.users[index],
      ...updates,
    };

    return this.users[index];
  }
}
