// src/app/routes/todoRoutes.ts
import { ExpressHttpServer } from '@infra/http/ExpressHttpServer';
import type { TodoController } from 'src/controllers/TodoController';
import { authMiddleware } from 'src/middleware/authMiddleware';

export function registerTodoRoutes(http: ExpressHttpServer, todoController: TodoController) {
  http.group('/todos', () => {
    http.registerRoute('POST', '/', todoController.create, [authMiddleware]);
    http.registerRoute('GET', '/', todoController.findByUser, [authMiddleware]);
    http.registerRoute('PATCH', '/:id/complete', todoController.complete, [authMiddleware]);
  });
}
