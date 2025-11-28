import type { IGeneratedQuery } from "@common/generateQuery";
import type { IUserRepository } from "@core/IUserRepository";
import type { User } from "@domain/User";
import { prisma } from "./client";

export class PrismaUserRepository implements IUserRepository {
  async create(user: Omit<User, 'id' | 'createdAt' | 'refreshToken'>): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const created = await prisma.user.create({
      omit: {
        password: true,
        refreshToken: true,
      },
      data: user,
    });
    return created;
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await prisma.user.findUnique({
      omit: {
        password: true,
      },
      where: { id },
    });
    return user
      ? {
          ...user,
          refreshToken: user.refreshToken ?? undefined,
        }
      : null;
  }

  async findAll(query: IGeneratedQuery): Promise<{ data: User[]; count: number; }> {
    const [users, count] = await Promise.all([
      prisma.user.findMany({
        take: query.take,
        skip: query.skip,
        orderBy: query.orderClause,
        where: query.whereClause
      }),
      prisma.user.count({
        where: query.whereClause
      })
    ]);
    
    return {
      data: users, 
      count
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user
      ? {
          ...user,
          refreshToken: user.refreshToken ?? undefined,
        }
      : null;
  }

  async update(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>> & { refreshToken?: string | null }): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: updates,
    });

    return {
      ...user,
      refreshToken: user.refreshToken ?? undefined,
    };
  }
}
