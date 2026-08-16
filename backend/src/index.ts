import cors, { CorsOptions } from "cors";
import express, { Application } from 'express';
import Routes from "./modules/routes";

export default class Server {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
  }

  // Configures middleware for the Express application
  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: "http://localhost:4200" // Angular default URL
    };

    app.use(cors(corsOptions));
    app.use(express.json());  // Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option
    app.use(express.urlencoded({ extended: true }));  // The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true).
  }
}