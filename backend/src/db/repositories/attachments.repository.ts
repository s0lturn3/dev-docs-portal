import AttachmentModel from "../../models/attachment.model";
import database from "../database";

const attachmentsRepository = {
  get: (id: number, callback: (record: AttachmentModel) => void) => {
    const sql = 'SELECT * FROM attachments WHERE id = ?';

    const params = [ id ];

    database.get(sql, params, (_err, row) => callback(row as AttachmentModel));
  },
  getList: (callback: (attachments: AttachmentModel[]) => void) => {
    const sql = 'SELECT * FROM attachments';

    const params: any[] = [];

    database.all(sql, params, (_err, rows) => callback(rows as AttachmentModel[]));
  }
};

export default attachmentsRepository;