import { ApiError } from '@common/httpErrors';
import type { UserService } from '@core/UserService';
import { CreateUserSchema } from '@dto/CreatedUserDTO';
import { GetUserListSchema } from '@dto/GetUserListDTO';
import { LoginUserSchema } from '@dto/LoginUserDTO';
import { RefreshUserTokenSchema } from '@dto/RefreshUserDTO';
import { Request, Response } from 'express';
import { constants } from 'http2';
import type { AuthRequest } from 'src/middleware/authMiddleware';

export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Create a new User.
   *
   * @route POST /users
   *
   * @param req.body {CreateUserSchema}
   * @param res - response object.
   *
   * @returns A JSON response with the created User object.
   *
   */
  create = async (req: Request, res: Response) => {
    const bodyParsed = CreateUserSchema.safeParse(req.body);

    if (!bodyParsed.success) {
      throw new ApiError('BAD_REQUEST', bodyParsed.error.message);
    }

    const data = await this.userService.createUser(req.body);

    res.status(constants.HTTP_STATUS_CREATED).json(data);
  };

  /**
   * Mark a User as completed.
   *
   * @route GET /users/:id/users
   *
   * @param req.params.id - The ID of the user.
   * @param res - response object.
   *
   * @returns A JSON response with the updated User object.
   *
   */
  findUserById = async (req: Request, res: Response) => {
    const data = await this.userService.findUser(req.params.id);
    res.status(constants.HTTP_STATUS_OK).json(data);
  };

  /**
   * Fetch all users belonging to a specific user.
   *
   * @route GET /users
   * @description
   * Retrieves all users associated with a given user ID.
   *
   * @param req -
   * @param res - response object.
   *
   * @returns A JSON array of User objects for the given user.
   *
   */
  findListUser = async (req: Request, res: Response) => {
    const queryParsed = GetUserListSchema.safeParse(req.query);
    
    if (!queryParsed.success) {
      throw new ApiError('BAD_REQUEST', queryParsed.error.message);
    }

    const data = await this.userService.findAllUser(queryParsed.data);
    res.status(constants.HTTP_STATUS_OK).json(data);
  };

  /**
   * Create a new User.
   *
   * @route POST /users/login
   *
   * @param req.body {LoginUserSchema}
   * @param res - response object.
   *
   * @returns A JSON response with the created User object.
   *
   */
  login = async (req: Request, res: Response) => {
    const bodyParsed = LoginUserSchema.safeParse(req.body);

    if (!bodyParsed.success) {
      throw new ApiError('BAD_REQUEST', bodyParsed.error.message);
    }

    const data = await this.userService.login(req.body);

    res.status(constants.HTTP_STATUS_CREATED).json(data);
  };

  /**
   * Create a new Access Token.
   *
   * @route POST /users/refresh
   *
   * @param req.body {RefreshUserTokenDTO}
   * @param res - response object.
   *
   * @returns A JSON response with the created User object.
   *
   */
  refresh = async (req: Request, res: Response) => {
    const bodyParsed = RefreshUserTokenSchema.safeParse(req.body);

    if (!bodyParsed.success) {
      throw new ApiError('BAD_REQUEST', bodyParsed.error.message);
    }

    const data = await this.userService.refresh(bodyParsed.data.refreshToken);

    res.status(constants.HTTP_STATUS_CREATED).json(data);
  };

  /**
   * Logout user.
   *
   * @route POST /users/logout
   *
   * @param req - 
   * @param res - response object.
   *
   * @returns A JSON response with the created User object.
   *
   */
  logout = async (req: AuthRequest, res: Response) => {
    await this.userService.logout(req.userId!);

    res.status(constants.HTTP_STATUS_NO_CONTENT);
  };



}
