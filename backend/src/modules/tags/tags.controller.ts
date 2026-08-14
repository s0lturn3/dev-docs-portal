import { Request, Response, Router } from "express";
import tagsRepository from "../../db/repositories/tags.repository";


// ENDPOINTS
export function getTag(req: Request, res: Response) {
  const id = +req.params.id;

  tagsRepository.get(id, (record) => {
    if (id) {
      return res.json(record);
    }
    else {
      return res.status(400).send();
    }
  });
}

export function getTags(req: Request, res: Response) {

  tagsRepository.getList((tags) => {
    return res.json(tags);
  });

}

export function createTag(req: Request, res: Response) {

}

export function updateTag(req: Request, res: Response) {

}

export function deleteTag(req: Request, res: Response) {

}


// CONTROLLER
class TagsController {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', getTags);
    this.router.get('/:id', getTag);

    this.router.post('/', createTag);
    this.router.put('/:id', updateTag);
    this.router.delete('/:id', deleteTag);
  }
}

export default new TagsController().router;