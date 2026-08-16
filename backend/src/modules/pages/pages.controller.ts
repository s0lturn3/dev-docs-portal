import { Request, Response, Router } from 'express';
import pagesRepository from '../../db/repositories/pages.repository';
import PageModel from '../../models/page.model';


export function getPages(req: Request, res: Response) {
  pagesRepository.list((pages) => {
    return res.json(pages);
  });
}

export function getPage(req: Request, res: Response) {
  const id = +req.params.id;

  if (!id) return res.status(400).send();

  pagesRepository.get(id, (page) => {
    if (!page) return res.status(404).send();
    return res.json(page);
  });
}

export function createPage(req: Request, res: Response) {
  const page: PageModel = req.body;

  if (!page) return res.status(400).send();

  pagesRepository.create(page, (lastID) => {
    if (!lastID || lastID == 0) return res.status(500).send();
    
    return res.status(201).location(`/${lastID}`).send();
  });
}

export function updatePage(req: Request, res: Response) {
  const id: number = +req.params.id;
  const page: PageModel = req.body;

  if (!id) return res.status(400).send();
  if (!page) return res.status(400).send();

  pagesRepository.update(id, page, (changes) => {
    if (!changes || changes == 0) return res.status(500).send();

    return res.status(204).send();
  });
}

export function deletePage(req: Request, res: Response) {
  const id: number = +req.params.id;

  if (!id) return res.status(400).send();

  pagesRepository.delete(id, (changes) => {
    if (!changes || changes == 0) return res.status(500).send();

    return res.status(204).send();
    // return res.status(204).send("Registro excluído com sucesso.");
  });
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