import { Request, Response, Router } from 'express';
import pagesRepository from '../../db/repositories/pages.repository';
import PageModel from '../../models/page.model';


/**
 * @swagger
 * /api/pages:
 *   get:
 *     tags:
 *       - Pages
 *     summary: Retrieves a list of pages
 *     responses:
 *       200:
 *         description: A list of pages
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
 *                   category_id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: Getting Started
 *                   slug:
 *                     type: string
 *                     example: getting-started
 *                   content_md:
 *                     type: string
 *                     example: "# Welcome to the docs"
 *                   created_by:
 *                     type: integer
 *                     example: 1
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-01-15T10:30:00Z"
 */
export function getPages(req: Request, res: Response) {
  pagesRepository.list((pages) => {
    return res.json(pages);
  });
}

/**
 * @swagger
 * /api/pages/{id}:
 *   get:
 *     tags:
 *       - Pages
 *     summary: Retrieves a specific page by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A page object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 category_id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: Getting Started
 *                 slug:
 *                   type: string
 *                   example: getting-started
 *                 content_md:
 *                   type: string
 *                   example: "# Welcome to the docs"
 *                 created_by:
 *                   type: integer
 *                   example: 1
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid page ID
 *       404:
 *         description: Page not found
 */
export function getPage(req: Request, res: Response) {
  const id = +req.params.id;

  if (!id) return res.status(400).send();

  pagesRepository.get(id, (page) => {
    if (!page) return res.status(404).send();
    return res.json(page);
  });
}

/**
 * @swagger
 * /api/pages/tag/{tagId}:
 *   get:
 *     tags:
 *       - Pages
 *     summary: Retrieves all pages associated with a specific tag
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the tag
 *     responses:
 *       200:
 *         description: A list of pages associated with the tag
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
 *                   category_id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: Getting Started
 *                   slug:
 *                     type: string
 *                     example: getting-started
 *                   content_md:
 *                     type: string
 *                     example: "# Welcome to the docs"
 *                   created_by:
 *                     type: integer
 *                     example: 1
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Invalid tag ID
 *       404:
 *         description: No pages found for this tag
 */
export function getPagesByTag(req: Request, res: Response) {
  const tagId = +req.params.tagId;

  if (!tagId) return res.status(400).send();

  pagesRepository.listByTag(tagId, (pages) => {
    if (!pages || pages.length === 0) return res.status(404).send();
    return res.json(pages);
  });
}

/**
 * @swagger
 * /api/pages:
 *   post:
 *     tags:
 *       - Pages
 *     summary: Creates a new page
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - title
 *               - slug
 *               - content_md
 *               - created_by
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: Getting Started
 *               slug:
 *                 type: string
 *                 example: getting-started
 *               content_md:
 *                 type: string
 *                 example: "# Welcome to the docs"
 *               created_by:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Page created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
export function createPage(req: Request, res: Response) {
  const page: PageModel = req.body;

  if (!page) return res.status(400).send();

  pagesRepository.create(page, (lastID) => {
    if (!lastID || lastID == 0) return res.status(500).send();
    
    return res.status(201).location(`/${lastID}`).send();
  });
}

/**
 * @swagger
 * /api/pages/{id}:
 *   put:
 *     tags:
 *       - Pages
 *     summary: Updates an existing page
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
 *               - category_id
 *               - title
 *               - slug
 *               - content_md
 *               - updated_by
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: Getting Started Guide
 *               slug:
 *                 type: string
 *                 example: getting-started
 *               content_md:
 *                 type: string
 *                 example: "# Updated content"
 *               updated_by:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       204:
 *         description: Page updated successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/pages/{id}:
 *   delete:
 *     tags:
 *       - Pages
 *     summary: Deletes a page
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Page deleted successfully
 *       400:
 *         description: Invalid page ID
 *       500:
 *         description: Internal server error
 */
export function deletePage(req: Request, res: Response) {
  const id: number = +req.params.id;

  if (!id) return res.status(400).send();

  pagesRepository.delete(id, (changes) => {
    if (!changes || changes == 0) return res.status(500).send();

    return res.status(204).send();
  });
}


class PagesController {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', getPages);
    this.router.get('/tag/:tagId', getPagesByTag);
    this.router.get('/:id', getPage);

    this.router.post('/', createPage);
    this.router.put('/:id', updatePage);
    this.router.delete('/:id', deletePage);
  }
}

export default new PagesController().router;