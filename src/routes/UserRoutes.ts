import { ExpressHttpServer } from '@infra/http/ExpressHttpServer';
import type { UserController } from 'src/controllers/UserController';
import { authMiddleware } from 'src/middleware/authMiddleware';

export class UserRoutes {
  private readonly prefix = '/users';

  constructor(private readonly http: ExpressHttpServer, private readonly controller: UserController) {}

  register() {
    this.http.group(this.prefix, () => {
      this.http.registerRoute('POST', '/', this.controller.create);
      this.http.registerRoute('POST', '/login', this.controller.login);
      this.http.registerRoute('POST', '/refresh', this.controller.refresh);
      this.http.registerRoute('POST', '/logout', this.controller.logout, [authMiddleware]);
      this.http.registerRoute('GET', '/', this.controller.findListUser);
      this.http.registerRoute('GET', '/:id', this.controller.findUserById);
    });
  }
}
