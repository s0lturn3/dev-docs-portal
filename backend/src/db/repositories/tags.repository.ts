import CategoryModel from "../../models/category.model";
import database from "../database";

const tagsRepository = {
  get: (id: number, callback: (record: CategoryModel) => void) => {
    const sql = 'SELECT * FROM tags WHERE id = ?';

    const params = [ id ];

    database.get(sql, params, (_err, row) => callback(row as CategoryModel));
  },
  getList: (callback: (records: CategoryModel[]) => void) => {
    const sql = 'SELECT * FROM tags';

    const params: any[] = [];

    database.all(sql, params, (_err, rows) => callback(rows as CategoryModel[]));
  }
}

export default tagsRepository;