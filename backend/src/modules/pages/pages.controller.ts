import { Request, Response, Router } from 'express';
import pagesRepository from '../../db/repositories/pages.repository';
import PageModel from '../../models/page.model';


export function getPages(req: Request, res: Response) {
  
  pagesRepository.getList((pages) => {
    return res.json(pages);
  });

}

export function getPage(req: Request, res: Response) {
  const id = +req.params.id;

  pagesRepository.get(id, (page) => {
    if (id) {
      return res.json(page);
    }
    else {
      return res.status(400).send();
    }
  });

}

export function createPage(req: Request, res: Response) {
  const page: PageModel = req.body;

  // TODO: Criar e salvar a página no banco de dados

  const id: number = page.id ?? 123;
  return res.status(201).location(`/${id}`).send();
}

export function updatePage(req: Request, res: Response) {
  const id: number = +req.params.id;
  const page: PageModel = req.body;

  // TODO: Atualizar o registro da página no banco de dados

  return res.status(204).send();
}

export function deletePage(req: Request, res: Response) {
  const id: number = +req.params.id;

  // TODO: Excluir registro da página no banco de dados

  return res.status(204).send("Registro excluído com sucesso.");
}


class PagesController {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', getPages);
    this.router.get('/:id', getPage);

    this.router.post('/', createPage);
    this.router.put('/:id', updatePage);
    this.router.delete('/:id', deletePage);
  }
}

export default new PagesController().router;