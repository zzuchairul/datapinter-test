import { TodoService } from '@core/TodoService';
import { UserService } from '@core/UserService';
import { ExpressHttpServer } from '@infra/http/ExpressHttpServer';
import { PrismaTodoRepository } from '@infra/prisma/PrismaTodoRepository';
import { PrismaUserRepository } from '@infra/prisma/PrismaUserRepository';
import { TodoController } from 'src/controllers/TodoController';
import { UserController } from 'src/controllers/UserController';
import { errorHandler } from 'src/middleware/errorHandler';
import { registerTodoRoutes } from 'src/routes/TodoRoutes';
import { UserRoutes } from 'src/routes/UserRoutes';
import { registerSchedulers } from 'src/scheduler/TodoReminderScheduler';

async function bootstrap() {
  
  // Wire up dependencies
  const userRepo = new PrismaUserRepository();
  const todoRepo = new PrismaTodoRepository();

  const userService = new UserService(userRepo);
  const todoService = new TodoService(todoRepo, userRepo);

  const userController = new UserController(userService);
  const todoController = new TodoController(todoService);
  
  console.log('Todo Reminder Service - Bootstrap Complete');
  console.log('Repositories and services initialized.');
  console.log('Note: HTTP server implementation left for candidate to add.');
  
  // Candidate should implement HTTP server here
  // Example: scheduler.scheduleRecurring('reminder-check', 60000, () => todoService.processReminders());
  
  // Init Express app
  const http = new ExpressHttpServer();

  // Scheduler
  registerSchedulers(todoRepo); 


  // API Route
  // Path: /users
  new UserRoutes(http, userController).register();

  // Path: /todos
  registerTodoRoutes(http, todoController);

  // Middleware
  http.registerMiddleware(errorHandler)

  // Listen server
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await http.listen(port);
  console.log(`Server running on port ${port}`);

  // TODO: Implement HTTP server with the following routes:
  // POST /users - Create a new user
  // GET /users/:id - Get user by ID
  // POST /todos - Create a new todo
  // GET /todos/:id - Get todo by ID
  // PUT /todos/:id - Update a todo
  // DELETE /todos/:id - Delete a todo
  // GET /users/:userId/todos - Get all todos for a user
  // POST /todos/:id/share - Share a todo with another user
}

bootstrap().catch(console.error);
