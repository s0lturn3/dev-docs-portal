import { Request, Response, Router } from "express";
import attachmentsRepository from "../../db/repositories/attachments.repository";
import AttachmentModel from "../../models/attachment.model";


// ENDPOINTS
export function getAttachments(req: Request, res: Response) {
  attachmentsRepository.list((attachments) => {
    return res.json(attachments);
  });
}

export function getAttachment(req: Request, res: Response) {
  const id = +req.params.id;

  if (!id) return res.status(400).send();

  attachmentsRepository.get(id, (attachment) => {
    if (!attachment) return res.status(404).send();
    return res.json(attachment);
  });
}

export function createAttachment(req: Request, res: Response) {
  const attachment: AttachmentModel = req.body;

  if (!attachment) return res.status(400).send();

  attachmentsRepository.create(attachment, (lastID) => {
    if (!lastID || lastID == 0) return res.status(500).send();

    return res.status(201).location(`/${lastID}`).send();
  });
}

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