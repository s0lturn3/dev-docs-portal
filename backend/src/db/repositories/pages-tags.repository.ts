import PageTagModel from "../../models/page-tag.model";
import database from "../database";

const pageTagsRepository = {
  get: (id: number, callback: (record?: PageTagModel) => void) => {
    const sql = 'SELECT * FROM page_tags WHERE id = ?';

    const params = [ id ];

    database.get(sql, params, (_err, row) => callback(row as PageTagModel) )
  },

  getList: (callback: (pages: PageTagModel[]) => void) => {
    const sql = 'SELECT * FROM page_tags';

    const params: any[] = [];

    database.all(sql, params, (_err, rows) => callback(rows as PageTagModel[]));
  },

  criar: (page: PageTagModel, callback: (page_id: number, tag_id: number) => void) => {
    const sql = 'INSERT INTO page_tags (page_id, tag_id) VALUES (?, ?)';

    const params = [ page.page_id, page.tag_id ];

    database.run(sql, params, function(_err) {
      callback(page.page_id, page.tag_id)
    })
  }
};

export default pageTagsRepository;