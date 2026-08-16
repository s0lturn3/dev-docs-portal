import { Request, Response, Router } from "express";
import tagsRepository from "../../db/repositories/tags.repository";
import TagModel from "../../models/tag.model";


// ENDPOINTS
export function getTags(req: Request, res: Response) {
  tagsRepository.list((tags) => {
    return res.json(tags);
  });
}

export function getTag(req: Request, res: Response) {
  const id = +req.params.id;

  if (!id) return res.status(400).send();

  tagsRepository.get(id, (tag) => {
    if (!tag) return res.status(404).send();
    return res.json(tag);
  });
}

export function createTag(req: Request, res: Response) {
  const tag: TagModel = req.body;

  if (!tag) return res.status(400).send();

  tagsRepository.create(tag, (lastID) => {
    if (!lastID || lastID == 0) return res.status(500).send();
    
    return res.status(201).location(`/${lastID}`).send();
  });
}

export function updateTag(req: Request, res: Response) {
  const id = +req.params.id;
  const tag: TagModel = req.body;

  if (!id) return res.status(400).send();
  if (!tag) return res.status(400).send();

  tagsRepository.update(id, tag, (changes) => {
    if (!changes || changes == 0) return res.status(500).send();

    return res.status(204).send();
  });
}

export function deleteTag(req: Request, res: Response) {
  const id = +req.params.id;

  if (!id) return res.status(400).send();

  tagsRepository.delete(id, (changes) => {
    if (!changes || changes == 0) return res.status(500).send();

    return res.status(204).send();
  });
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