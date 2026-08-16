import { Application } from "express";

import attachmentsController from "./attachments/attachments.controller";
import categoriesController from "./categories/categories.controller";
import pagesController from "./pages/pages.controller";
import tagsController from "./tags/tags.controller";
import usersController from "./users/users.controller";

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export default class Routes {
  constructor(app: Application) {
    // Configure the app to use Swagger
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'DevDocs Portal',
          version: '1.0.0',
          description: 'Internal documentation portal APIs',
        },
        tags: [
          {
            name: 'Users',
            description: 'User management endpoints',
          },
          {
            name: 'Pages',
            description: 'Page content management endpoints',
          },
          {
            name: 'Categories',
            description: 'Category management endpoints',
          },
          {
            name: 'Tags',
            description: 'Tag management endpoints',
          },
          {
            name: 'Attachments',
            description: 'File attachment management endpoints',
          },
        ],
      },
      apis: ['./src/**/*.controller.ts'],
    };

    const swaggerDocs = swaggerJsdoc(swaggerOptions);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    app.use('/api/pages', pagesController);
    app.use('/api/users', usersController);
    app.use('/api/categories', categoriesController);
    app.use('/api/tags', tagsController);
    app.use('/api/attachments', attachmentsController);

    // Default route to handle non-matching requests
    app.use((req, res) => {
      res.status(404).json({ message: 'Route not found' });
    })
  }
}