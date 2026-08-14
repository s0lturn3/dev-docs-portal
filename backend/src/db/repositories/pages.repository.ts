import PageModel from "../../models/page.model";
import database from "../database";

const pagesRepository = {
  get: (id: number, callback: (record?: PageModel) => void) => {
    const sql = 'SELECT * FROM pages WHERE id = ?';

    const params = [ id ];

    database.get(sql, params, (_err, row) => callback(row as PageModel) )
  },

  getList: (callback: (pages: PageModel[]) => void) => {
    const sql = 'SELECT * FROM pages';

    const params: any[] = [];

    database.all(sql, params, (_err, rows) => callback(rows as PageModel[]));
  },

  criar: (page: PageModel, callback: (id?: number) => void) => {
    const sql = 'INSERT INTO pages (title, slug) VALUES (?, ?)';

    const params = [ page.title, page.slug ];

    database.run(sql, params, function(_err) {
      callback(this?.lastID)
    })
  }
};

export default pagesRepository;