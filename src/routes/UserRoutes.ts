// src/app/routes/userRoutes.ts
import { ExpressHttpServer } from '@infra/http/ExpressHttpServer';
import type { UserController } from 'src/controllers/UserController';
import { authMiddleware } from 'src/middleware/authMiddleware';

export function registerUserRoutes(http: ExpressHttpServer, userController: UserController) {
  const prefix = '/users';

  /**
   * @route POST /users
   * @description Create a new user
   * @body {
   *   name: string,
   *   email: string
   * }
   * @returns User object
   */
  http.registerRoute('POST', `${prefix}`, userController.create);
  
  /**
   * @route POST /users/login
   * @description Login user
   * @body {
   *   email: string
   *   password: string,
   * }
   * @returns User object with jwt token
   */
  http.registerRoute('POST', `${prefix}/login`, userController.login);

  /**
   * @route POST /users/refresh
   * @description Refresh Access Token user
   * @body {
   *   email: string
   *   password: string,
   * }
   * @returns User object with jwt token
   */
  http.registerRoute('POST', `${prefix}/refresh`, userController.refresh);

  /**
   * @route POST /users/logout
   * @description Logouts user
   */
  http.registerRoute('POST', `${prefix}/refresh`, userController.logout, [authMiddleware]);

  /**
   * @route GET /users
   * @description Get a list of all users
   * @returns Array of users
   */
  http.registerRoute('GET', `${prefix}`, userController.findListUser);

  /**
   * @route GET /users/:id
   * @description Get user by ID
   * @params { id: string } - User ID
   * @returns User object
   */
  http.registerRoute('GET', `${prefix}/:id`, userController.findUserById);
}
