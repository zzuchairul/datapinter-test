// src/app/routes/userRoutes.ts
import { ExpressHttpServer } from '@infra/http/ExpressHttpServer';
import type { TodoController } from 'src/controllers/TodoController';
import { authMiddleware } from 'src/middleware/authMiddleware';

export function registerTodoRoutes(http: ExpressHttpServer, todoController: TodoController) {
  const prefix = '/todos';

  /**
   * @route POST /todos
   * @description Create a new user
   * @body
   *   title: string;
   *   description: string;
   *   userId: string;
   *   remindAt: string;
   *
   * @returns Todo object
   */
  http.registerRoute('POST', `${prefix}`, todoController.create, [authMiddleware]);

  /**
   * @route GET /todos
   * @description Get list todos
   * @query {
   *   limit: string, digit of numbers;
   *   page: string, digit of numbers;
   * }
   *
   * @returns Array of Todo object
   */
  http.registerRoute('GET', `${prefix}`, todoController.findByUser, [authMiddleware]);

  /**
   * @route patch /todos/:id/complete
   * @description Mark todos status as done
   *
   * @returns Todo object
   */
  http.registerRoute('PATCH', `${prefix}/:id/complete`, todoController.complete);
}
