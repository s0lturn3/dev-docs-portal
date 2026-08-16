import { Request, Response, Router } from "express";
import CategoryModel from "../../models/category.model";
import categoriesRepository from "./categories.repository";


// ENDPOINTS
/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Retrieves a list of categories
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Backend
 *                   slug:
 *                     type: string
 *                     example: backend
 *                   parent_id:
 *                     type: integer
 *                     example: 0
 *                   sort_order:
 *                     type: integer
 *                     example: 1
 */
export function getCategories(req: Request, res: Response) {
  categoriesRepository.list((categories) => {
    return res.json(categories);
  });
}

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Retrieves a specific category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A category object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Backend
 *                 slug:
 *                   type: string
 *                   example: backend
 *                 parent_id:
 *                   type: integer
 *                   example: 0
 *                 sort_order:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Invalid category ID
 *       404:
 *         description: Category not found
 */
export function getCategory(req: Request, res: Response) {
  const id = +req.params.id;

  if (!id) return res.status(400).send();

  categoriesRepository.get(id, (category) => {
    if (!category) return res.status(404).send();
    return res.json(category);
  });
}

/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Creates a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *               - parent_id
 *               - sort_order
 *             properties:
 *               name:
 *                 type: string
 *                 example: Frontend
 *               slug:
 *                 type: string
 *                 example: frontend
 *               parent_id:
 *                 type: integer
 *                 example: 0
 *               sort_order:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
export function createCategory(req: Request, res: Response) {
  const category: CategoryModel = req.body;

  if (!category) return res.status(400).send();

  categoriesRepository.create(category, (lastID) => {
    if (!lastID || lastID == 0) return res.status(500).send();
    
    return res.status(201).location(`/${lastID}`).send();
  });
}

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     tags:
 *       - Categories
 *     summary: Updates an existing category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *               - parent_id
 *               - sort_order
 *             properties:
 *               name:
 *                 type: string
 *                 example: Frontend Development
 *               slug:
 *                 type: string
 *                 example: frontend-dev
 *               parent_id:
 *                 type: integer
 *                 example: 0
 *               sort_order:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       204:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Deletes a category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       400:
 *         description: Invalid category ID
 *       500:
 *         description: Internal server error
 */
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