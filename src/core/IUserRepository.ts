import { User } from "../domain/User";

export interface IUserRepository {
  create(user: Omit<User, 'id' | 'createdAt' | 'refreshToken'>): Promise<Omit<User, 'password'>>;
  findById(id: string): Promise<Omit<User, 'password'> | null>;
  findAll(): Promise<Omit<User, 'password'>[]>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User>;
}
