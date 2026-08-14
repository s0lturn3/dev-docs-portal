import CategoryModel from "../../models/category.model";
import database from "../database";

const categoriesRepository = {
  get: (id: number, callback: (category: CategoryModel) => void) => {
    const sql = 'SELECT * FROM categories WHERE id = ?';

    const params = [ id ];

    database.get(sql, params, (_err, record) => callback(record as CategoryModel));
  },
  getList: (callback: (categories: CategoryModel[]) => void) => {
    const sql = 'SELECT * FROM categories';

    const params: any[] = [ ];

    database.all(sql, params, (_err, records) => callback(records as CategoryModel[]));
  }
};

export default categoriesRepository;