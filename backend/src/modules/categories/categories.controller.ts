import { Request, Response, Router } from "express";
import categoriesRepository from "../../db/repositories/categories.repository";


// ENDPOINTS
export function getCategory(req: Request, res: Response) {
  const id = +req.params.id;

  categoriesRepository.get(id, (category) => {
    if (id) {
      return res.json(category);
    }
    else {
      return res.status(400).send();
    }
  });
}

export function getCategories(req: Request, res: Response) {
  categoriesRepository.getList((categories) => {
    return res.json(categories);
  });
}

export function createCategory(req: Request, res: Response) {

}

export function updateCategory(req: Request, res: Response) {

}

export function deleteCategory(req: Request, res: Response) {

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