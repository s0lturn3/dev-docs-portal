import { Request, Response, Router } from "express";
import attachmentsRepository from "../../db/repositories/attachments.repository";


// ENDPOINTS
export function getAttachments(req: Request, res: Response) {
  attachmentsRepository.getList((attachments) => {
    return res.json(attachments);
  });
}

export function getAttachment(req: Request, res: Response) {
  const id = +req.params.id;

  attachmentsRepository.get(id, (attachment) => {
    if (id) {
      return res.json(attachment);
    }
    else {
      return res.status(400).send();
    }
  });
}

export function createAttachment(req: Request, res: Response) {

}

export function updateAttachment(req: Request, res: Response) {

}

export function deleteAttachment(req: Request, res: Response) {

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
    this.router.put('/:id', updateAttachment);
    this.router.delete('/:id', deleteAttachment);
  }
}

export default new AttachmentsController().router;