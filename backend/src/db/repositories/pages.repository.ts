import PageModel from "../../models/page.model";
import database from "../database";

const pagesRepository = {
  get: (id: number, callback: (record?: PageModel) => void) => {
    const sql = `
      SELECT  *
      FROM    pages
      WHERE   id = ?
    `;

    const params = [ id ];

    database.get<PageModel>(sql, params, (_err, row) => callback(row));
  },

  list: (callback: (pages: PageModel[]) => void) => {
    const sql = `
      SELECT  *
      FROM    pages
    `;

    const params: any[] = [];

    database.all<PageModel>(sql, params, (_err, rows) => callback(rows));
  },

  create: (page: PageModel, callback: (lastID?: number) => void) => {
    const sql = `
      INSERT INTO pages
        ( category_id,
          title,
          slug,
          content_md,
          created_by,
          created_at  )
      VALUES
        ( ?,
          ?,
          ?,
          ?,
          ?,
          ? )
    `;

    const params = [
      page.category_id,
      page.title,
      page.slug,
      page.content_md,
      page.created_by,
      page.created_at,
    ];

    database.run(sql, params, function(_err) {
      callback(this?.lastID)
    })
  },
  
  update: (id: number, page: PageModel, callback: (changes?: number) => void) => {
    const sql = `
      UPDATE  pages
      SET     category_id = ?,
              title = ?,
              slug = ?,
              content_md = ?,
              updated_by = ?,
              updated_at = ?

      WHERE   id = ?
    `;

    const params = [
      page.category_id,
      page.title,
      page.slug,
      page.content_md,
      page.updated_by,
      new Date(),
      page.id ?? id,
    ];

    database.run(sql, params, function(_err) {
      callback(this?.changes)
    });
  },

  delete: (id: number, callback: (changes?: number) => void) => {
    const sql = `
      DELETE FROM pages
      WHERE       id = ?
    `;

    const params = [ id ];

    database.run(sql, params, function(_err) {
      callback(this?.changes)
    })
  },
};

export default pagesRepository;