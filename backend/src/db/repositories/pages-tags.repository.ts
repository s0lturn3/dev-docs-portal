import PageTagModel from "../../models/page-tag.model";
import database from "../database";

const pageTagsRepository = {
  get: (pageID: number, tagID: number, callback: (record?: PageTagModel) => void) => {
    const sql = `
      SELECT  *
      FROM    page_tags
      WHERE   page_id = ?
        AND   tag_id = ?
    `;

    const params = [ pageID, tagID ];

    database.get<PageTagModel>(sql, params, (_err, row) => callback(row));
  },

  getTags: (pageID: number, callback: (records: PageTagModel[]) => void) => {
    const sql = `
      SELECT  *
      FROM    page_tags
      WHERE   page_id = ?
    `;

    const params = [ pageID ];

    database.all<PageTagModel>(sql, params, (_err, rows) => callback(rows));
  },
  getPages: (tagID: number, callback: (records: PageTagModel[]) => void) => {
    const sql = `
      SELECT  *
      FROM    page_tags
      WHERE   tag_id = ?
    `;

    const params = [ tagID ];

    database.all<PageTagModel>(sql, params, (_err, rows) => callback(rows));
  },

  create: (record: PageTagModel, callback: (page_id: number, tag_id: number) => void) => {
    const sql = `
      INSERT INTO page_tags (page_id, tag_id)
      VALUES      (?, ?)
    `;

    const params = [ record.page_id, record.tag_id ];

    database.run(sql, params, (_err) => {
      callback(record.page_id, record.tag_id)
    });
  },

  delete: (pageID: number, tagID: number, callback: (changes?: number) => void) => {
    const sql = `
      DELETE FROM page_tags
      WHERE       page_id = ?
        AND       tag_id = ?
    `;

    const params = [ pageID, tagID ];

    database.run(sql, params, function(_err) {
      callback(this?.changes)
    });
  }
};

export default pageTagsRepository;