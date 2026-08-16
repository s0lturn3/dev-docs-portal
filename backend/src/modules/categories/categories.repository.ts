import database from "../../db/database";
import CategoryModel from "../../models/category.model";

const categoriesRepository = {
  get: (id: number, callback: (category: CategoryModel) => void) => {
    const sql = `
      SELECT  *
      FROM    categories
      WHERE   id = ?
    `;

    const params = [ id ];

    database.get<CategoryModel>(sql, params, (_err, record) => callback(record));
  },

  list: (callback: (categories: CategoryModel[]) => void) => {
    const sql = `
      SELECT  *
      FROM    categories
    `;

    const params: any[] = [ ];

    database.all<CategoryModel>(sql, params, (_err, records) => callback(records));
  },

  create: (category: CategoryModel, callback: (lastID?: number) => void) => {
    const sql = `
      INSERT INTO categories
        ( name,
          slug,
          parent_id,
          sort_order  )
      VALUES
        ( name,
          slug,
          parent_id,
          sort_order  )
    `;

    const params = [
      category.name,
      category.slug,
      category.parent_id,
      category.sort_order,
    ];

    database.run(sql, params, function(_err) {
      callback(this?.lastID);
    });
  },

  update: (id: number, category: CategoryModel, callback: (changes?: number) => void) => {
    const sql = `
      UPDATE  categories
      SET     name = ?,
              slug = ?,
              parent_id = ?,
              sort_order = ?

      WHERE   id = ?
    `;

    const params = [
      category.name,
      category.slug,
      category.parent_id,
      category.sort_order,
      category.id ?? id
    ];

    database.run(sql, params, function(_err) {
      callback(this?.changes);
    });
  },

  delete: (id: number, callback: (changes?: number) => void) => {
    const sql = `
      DELETE FROM categories
      WHERE       id = ?
    `;

    const params = [ id ];

    database.run(sql, params, function(_err) {
      callback(this.changes);
    });
  }
};

export default categoriesRepository;