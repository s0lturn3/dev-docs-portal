import { Request, Response, Router } from "express";
import AttachmentModel from "../../models/attachment.model";
import attachmentsRepository from "./attachments.repository";


// ENDPOINTS
/**
 * @swagger
 * /api/attachments:
 *   get:
 *     tags:
 *       - Attachments
 *     summary: Retrieves a list of attachments
 *     responses:
 *       200:
 *         description: A list of attachments
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
 *                   page_id:
 *                     type: integer
 *                     example: 1
 *                   file_name:
 *                     type: string
 *                     example: example.pdf
 *                   stored_name:
 *                     type: string
 *                     example: 1234567890-example.pdf
 *                   mime_type:
 *                     type: string
 *                     example: application/pdf
 *                   size_bytes:
 *                     type: integer
 *                     example: 1024000
 *                   uploaded_by:
 *                     type: integer
 *                     example: 1
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-01-15T10:30:00Z"
 */
export function getAttachments(req: Request, res: Response) {
  attachmentsRepository.list((attachments) => {
    return res.json(attachments);
  });
}

/**
 * @swagger
 * /api/attachments/{id}:
 *   get:
 *     tags:
 *       - Attachments
 *     summary: Retrieves a specific attachment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: An attachment object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 page_id:
 *                   type: integer
 *                   example: 1
 *                 file_name:
 *                   type: string
 *                   example: example.pdf
 *                 stored_name:
 *                   type: string
 *                   example: 1234567890-example.pdf
 *                 mime_type:
 *                   type: string
 *                   example: application/pdf
 *                 size_bytes:
 *                   type: integer
 *                   example: 1024000
 *                 uploaded_by:
 *                   type: integer
 *                   example: 1
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid attachment ID
 *       404:
 *         description: Attachment not found
 */
export function getAttachment(req: Request, res: Response) {
  const id = +req.params.id;

  if (!id) return res.status(400).send();

  attachmentsRepository.get(id, (attachment) => {
    if (!attachment) return res.status(404).send();
    return res.json(attachment);
  });
}

/**
 * @swagger
 * /api/attachments:
 *   post:
 *     tags:
 *       - Attachments
 *     summary: Creates a new attachment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - page_id
 *               - file_name
 *               - stored_name
 *               - mime_type
 *               - size_bytes
 *               - uploaded_by
 *             properties:
 *               page_id:
 *                 type: integer
 *                 example: 1
 *               file_name:
 *                 type: string
 *                 example: documentation.pdf
 *               stored_name:
 *                 type: string
 *                 example: 1234567890-documentation.pdf
 *               mime_type:
 *                 type: string
 *                 example: application/pdf
 *               size_bytes:
 *                 type: integer
 *                 example: 2048000
 *               uploaded_by:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Attachment created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
export function createAttachment(req: Request, res: Response) {
  const attachment: AttachmentModel = req.body;

  if (!attachment) return res.status(400).send();

  attachmentsRepository.create(attachment, (lastID) => {
    if (!lastID || lastID == 0) return res.status(500).send();

    return res.status(201).location(`/${lastID}`).send();
  });
}

/**
 * @swagger
 * /api/attachments/{id}:
 *   delete:
 *     tags:
 *       - Attachments
 *     summary: Deletes an attachment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Attachment deleted successfully
 *       400:
 *         description: Invalid attachment ID
 *       500:
 *         description: Internal server error
 */
export function deleteAttachment(req: Request, res: Response) {
  const id: number = +req.params.id;
  const attachment: AttachmentModel = req.body;

  if (!attachment) return res.status(400).send();

  attachmentsRepository.delete(id, (changes) => {
    if (!changes || changes == 0) return res.status(500).send();

    return res.status(204).send();
  });
}


// CONTROLLER
class AttachmentsController {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', getAttachments);
    this.router.get('/:id', getAttachment);

    this.router.post('/', createAttachment);
    this.router.delete('/:id', deleteAttachment);
  }
}

export default new AttachmentsController().router;