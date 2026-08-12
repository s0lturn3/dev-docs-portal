import { Request, Response, Router } from 'express';


export function getPage(req: Request, res: Response) {
  return res.json({ page: "Conteúdo da página buscada: ..." });
}


class PagesController {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/page', getPage);
  }
}


export default new PagesController().router;  // here we export the controller class router