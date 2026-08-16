import { Request, Response, Router } from "express";
import categoriesRepository from "../../db/repositories/categories.repository";
import CategoryModel from "../../models/category.model";


// ENDPOINTS
export function getCategories(req: Request, res: Response) {
  categoriesRepository.list((categories) => {
    return res.json(categories);
  });
}

export function getCategory(req: Request, res: Response) {
  const id = +req.params.id;

  if (!id) return res.status(400).send();

  categoriesRepository.get(id, (category) => {
    if (!category) return res.status(404).send();
    return res.json(category);
  });
}

export function createCategory(req: Request, res: Response) {
  const category: CategoryModel = req.body;

  if (!category) return res.status(400).send();

  categoriesRepository.create(category, (lastID) => {
    if (!lastID || lastID == 0) return res.status(500).send();
    
    return res.status(201).location(`/${lastID}`).send();
  });
}

export function updateCategory(req: Request, res: Response) {
  const id = +req.params.id;
  const category: CategoryModel = req.body;

  if (!id) return res.status(400).send();
  if (!category) return res.status(400).send();

  categoriesRepository.update(id ,category, (changes) => {
    if (!changes || changes == 0) return res.status(500).send();

    return res.status(204).send();
  });
}

export function deleteCategory(req: Request, res: Response) {
  const id = +req.params.id;

  if (!id) return res.status(400).send();

  categoriesRepository.delete(id, (changes) => {
    if (!changes || changes == 0) return res.status(500).send();

    return res.status(204).send();
  });
}


// CONTROLLER
class CategoriesController {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get('/', getCategories);
    this.router.get('/:id', getCategory);

    this.router.post('/', createCategory);
    this.router.put('/:id', updateCategory);
    this.router.delete('/:id', deleteCategory);
  }
}

export default new CategoriesController().router;