import { Application } from "express";
import pagesController from "./pages/pages.controller";

export default class Routes {
  constructor(app: Application) {
    app.use('/api/pages', pagesController); // Example of how to use routes
  }
}