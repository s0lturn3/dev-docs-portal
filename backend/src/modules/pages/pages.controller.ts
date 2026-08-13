import { Request, Response, Router } from 'express';
import PageModel from '../../models/page.model';


export function getPages(req: Request, res: Response) {
  const pages: PageModel[] = [
    { id: 1, category_id: 2, title: 'Introdução', slug: 'introducao', content_md: '', created_by: 1, created_at: new Date() },
    { id: 2, category_id: 3, title: 'Instalação', slug: 'instalacao', content_md: '', created_by: 1, created_at: new Date() },
    { id: 3, category_id: 5, title: 'Componentes', slug: 'componentes', content_md: '', created_by: 1, created_at: new Date() },
    { id: 4, category_id: 1, title: 'Ícones', slug: 'icones', content_md: '', created_by: 1, created_at: new Date() },
  ];

  return res.json(pages);
}

export function getPage(req: Request, res: Response) {
  const id = +req.params.id;

  const page: PageModel = {
    id: id,
    category_id: 2,
    title: '',
    slug: '',
    content_md: '',
    created_by: 1,
    created_at: new Date(),
  };

  return res.json(page);
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


export default new PagesController().router;  // here we export the controller class router