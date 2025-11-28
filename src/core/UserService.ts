import { compared, hashed } from "@common/bcrypt";
import { ApiError } from "@common/httpErrors";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@common/jwt";
import type { CreateUserDTO } from "@dto/CreatedUserDTO";
import type { LoginUserDTO } from "@dto/LoginUserDTO";
import type { User } from "@lib/prisma/client";
import type { IUserRepository } from "./IUserRepository";

export class UserService {
  constructor(private userRepo: IUserRepository) {}

  async createUser(data: CreateUserDTO): Promise<Omit<User, 'password' | 'refreshToken'>> {
    if (!data.name) {
      throw new ApiError('BAD_REQUEST', 'name field is reuquired');
    }
    if (!data.email) {
      throw new ApiError('BAD_REQUEST', 'email field is reuquired');
    }
    if (!data.password) {
      throw new ApiError('BAD_REQUEST', 'password field is reuquired');
    }

    const emailExist = await this.userRepo.findByEmail(data.email);
    if (emailExist) {
      throw new ApiError('CONFLICT', 'email already registred');
    }

    const hashedPassword = await hashed(data.password);

    const user = await this.userRepo.create({
      ...data,
      password: hashedPassword,
    });

    return user;
  }

  async findUser(id: string): Promise<Omit<User, 'password' | 'refreshToken'> | null> {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new ApiError('NOT_FOUND', `user with id ${id} not found`);
    }

    return user;
  }

  async findAllUser(): Promise<Omit<User, 'password' | 'refreshToken'>[]> {
    const users = await this.userRepo.findAll();
    return users;
  }

  async login(data: LoginUserDTO): Promise<{
    user: Omit<User, 'password' | 'refreshToken'>;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.userRepo.findByEmail(data.email);

    if (!user) {
      throw new ApiError('NOT_FOUND', `user with email ${data.email} not found`);
    }

    const isPasswordValid = await compared(data.password, user.password);

    if (!isPasswordValid) {
      throw new ApiError('UNAUTHORIZED', `email or password invalid`);
    }

    const payload = {
      userId: user.id,
      email: user.email,
    };

    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    await this.userRepo.update(user.id, { refreshToken: newRefreshToken });

    // filter field
    const { password, refreshToken, ...safedUser } = user;

    return {
      user: safedUser,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<{
    user: Omit<User, 'password' | 'refreshToken'>;
    accessToken: string;
    refreshToken: string;
  }> {
    // check if token exist in user
    const tokenPayload = verifyRefreshToken(refreshToken);

    const newTokenPayload = {
      userId: tokenPayload.userId,
      email: tokenPayload.email
    };

    const newAccessToken = signAccessToken(newTokenPayload);
    const newRefreshToken = signRefreshToken(newTokenPayload);

    const user = await this.userRepo.update(tokenPayload.userId, { refreshToken: newRefreshToken });

    // filter field
    const { password, refreshToken: rt, ...safedUser } = user;

    return {
      user: safedUser,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.userRepo.update(userId, {
      refreshToken: null
    })
  }
}