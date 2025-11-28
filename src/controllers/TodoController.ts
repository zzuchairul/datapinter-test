import { ApiError } from '@common/httpErrors';
import type { TodoService } from '@core/TodoService';
import { CreateTodoSchema } from '@dto/CreateTodoDTO';
import { GetTodoListSchema } from '@dto/GetTodoListDTO';
import { Request, Response } from 'express';
import { constants } from 'http2';
import type { AuthRequest } from 'src/middleware/authMiddleware';

export class TodoController {
  constructor(private todoService: TodoService) {}

  /**
   * Create a new Todo.
   *
   * @route POST /todos
   *
   * @param req.body {CreateTodoSchema}
   * @param res - response object.
   *
   * @returns A JSON response with the created Todo object.
   *
   */
  create = async (req: AuthRequest, res: Response) => {
    const bodyParsed = CreateTodoSchema.safeParse(req.body);

    if (!bodyParsed.success) {
      throw new ApiError('BAD_REQUEST', bodyParsed.error.message);
    }
    const data = await this.todoService.createTodo(req.userId!, req.body);
    res.status(constants.HTTP_STATUS_CREATED).json(data);
  };

  /**
   * Find list of todos
   *
   * @route GET /todos
   *
   * @param req.params {
   *   limit: string, digit of numbers;
   *   page: string, digit of numbers;
   * }
   * @param res - response object
   *
   * @returns A JSON response with list of Todo object.
   *
   */

  findByUser = async (req: AuthRequest, res: Response) => {
    const queryParsed = GetTodoListSchema.safeParse(req.query);

    if (!queryParsed.success) {
      throw new ApiError('BAD_REQUEST', queryParsed.error.message);
    }

    const data = await this.todoService.getTodosByUser(req.userId!, queryParsed.data);

    res.status(constants.HTTP_STATUS_OK).json({
      ...data,
      page: queryParsed.data.page,
    });
  };

  /**
   * Mark todo as done
   *
   * @route PATCH /todos/:id/complete
   *
   * @param req.params - todo id 
   * @param res - response object
   *
   * @returns A JSON response with list of Todo object.
   *
   */
  complete = async (req: Request, res: Response) => {
    const data = await this.todoService.completeTodo(req.params.id);

    res.status(constants.HTTP_STATUS_OK).json(data);
  };
}
