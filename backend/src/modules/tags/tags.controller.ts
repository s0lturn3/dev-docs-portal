import { Request, Response, Router } from "express";
import tagsRepository from "../../db/repositories/tags.repository";
import TagModel from "../../models/tag.model";


// ENDPOINTS
/**
 * @swagger
 * /api/tags:
 *   get:
 *     tags:
 *       - Tags
 *     summary: Retrieves a list of tags
 *     responses:
 *       200:
 *         description: A list of tags
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
 *                     example: JavaScript
 */
export function getTags(req: Request, res: Response) {
  tagsRepository.list((tags) => {
    return res.json(tags);
  });
}

/**
 * @swagger
 * /api/tags/{id}:
 *   get:
 *     tags:
 *       - Tags
 *     summary: Retrieves a specific tag by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A tag object
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
 *                   example: JavaScript
 *       400:
 *         description: Invalid tag ID
 *       404:
 *         description: Tag not found
 */
export function getTag(req: Request, res: Response) {
  const id = +req.params.id;

  if (!id) return res.status(400).send();

  tagsRepository.get(id, (tag) => {
    if (!tag) return res.status(404).send();
    return res.json(tag);
  });
}

/**
 * @swagger
 * /api/tags/page/{pageId}:
 *   get:
 *     tags:
 *       - Tags
 *     summary: Retrieves all tags associated with a specific page
 *     parameters:
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the page
 *     responses:
 *       200:
 *         description: A list of tags associated with the page
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
 *                     example: angular
 *       400:
 *         description: Invalid page ID
 *       404:
 *         description: No tags found for this page
 */
export function getTagsByPage(req: Request, res: Response) {
  const pageId = +req.params.pageId;

  if (!pageId) return res.status(400).send();

  tagsRepository.listByPage(pageId, (tags) => {
    if (!tags || tags.length === 0) return res.status(404).send();
    return res.json(tags);
  });
}

/**
 * @swagger
 * /api/tags:
 *   post:
 *     tags:
 *       - Tags
 *     summary: Creates a new tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: TypeScript
 *     responses:
 *       201:
 *         description: Tag created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
export function createTag(req: Request, res: Response) {
  const tag: TagModel = req.body;

  if (!tag) return res.status(400).send();

  tagsRepository.create(tag, (lastID) => {
    if (!lastID || lastID == 0) return res.status(500).send();
    
    return res.status(201).location(`/${lastID}`).send();
  });
}

/**
 * @swagger
 * /api/tags/{id}:
 *   put:
 *     tags:
 *       - Tags
 *     summary: Updates an existing tag
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Python
 *     responses:
 *       204:
 *         description: Tag updated successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/tags/{id}:
 *   delete:
 *     tags:
 *       - Tags
 *     summary: Deletes a tag
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Tag deleted successfully
 *       400:
 *         description: Invalid tag ID
 *       500:
 *         description: Internal server error
 */
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
    this.router.get('/page/:pageId', getTagsByPage);
    this.router.get('/:id', getTag);

    this.router.post('/', createTag);
    this.router.put('/:id', updateTag);
    this.router.delete('/:id', deleteTag);
  }
}

export default new TagsController().router;