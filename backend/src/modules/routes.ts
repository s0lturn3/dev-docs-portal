import { Application } from "express";

import attachmentsController from "./attachments/attachments.controller";
import usersController from "./auth/users.controller";
import categoriesController from "./categories/categories.controller";
import pagesController from "./pages/pages.controller";
import tagsController from "./tags/tags.controller";

export default class Routes {
  constructor(app: Application) {
    app.use('/api/pages', pagesController);
    app.use('/api/users', usersController);
    app.use('/api/categories', categoriesController);
    app.use('/api/tags', tagsController);
    app.use('/api/attachments', attachmentsController);

    // Rota padrão para lidar com solicitações não correspondentes
    app.use((req, res) => {
      res.status(404).json({ message: 'Rota não encontrada' });
    })
  }
}