import { Application } from "express";
import pagesController from "./pages/pages.controller";

export default class Routes {
  constructor(app: Application) {
    app.use('/api/pages', pagesController); // Example of how to use routes

    // Rota padrão para lidar com solicitações não correspondentes
    app.use((req, res) => {
      res.status(404).json({ message: 'Rota não encontrada' });
    })
  }
}