import AttachmentModel from "../../models/attachment.model";
import database from "../database";

const attachmentsRepository = {
  get: (id: number, callback: (record: AttachmentModel) => void) => {
    const sql = `
      SELECT  *
      FROM    attachments
      WHERE   id = ?
    `;

    const params = [ id ];

    database.get<AttachmentModel>(sql, params, (_err, row) => callback(row));
  },

  list: (callback: (attachments: AttachmentModel[]) => void) => {
    const sql = `
      SELECT  *
      FROM    attachments
    `;

    const params: any[] = [];

    database.all<AttachmentModel>(sql, params, (_err, rows) => callback(rows));
  },

  create: (attachment: AttachmentModel, callback: (lastID?: number) => void) => {
    const sql = `
      INSERT INTO attachments
        ( page_id,
          file_name,
          stored_name,
          mime_type,
          size_bytes,
          uploaded_by,
          created_at  )
      VALUES
        ( page_id,
          file_name,
          stored_name,
          mime_type,
          size_bytes,
          uploaded_by,
          created_at  )
    `;

    const params = [
      attachment.page_id,
      attachment.file_name,
      attachment.stored_name,
      attachment.mime_type,
      attachment.size_bytes,
      attachment.uploaded_by,
      new Date()
    ];

    database.run(sql, params, function(_err) {
      callback(this?.lastID);
    });
  },

  delete: (id: number, callback: (changes?: number) => void) => {
    const sql = `
      DELETE FROM attachments
      WHERE       id = ?
    `;

    const params = [ id ];

    database.run(sql, params, function(_err) {
      callback(this?.changes);
    });
  }
};

export default attachmentsRepository;