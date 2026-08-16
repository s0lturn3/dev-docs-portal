import TagModel from "../../models/tag.model";
import database from "../database";

const tagsRepository = {
  get: (id: number, callback: (record: TagModel) => void) => {
    const sql = `
      SELECT  *
      FROM    tags
      WHERE   id = ?
    `;

    const params = [ id ];

    database.get<TagModel>(sql, params, (_err, row) => callback(row));
  },

  list: (callback: (records: TagModel[]) => void) => {
    const sql = `
      SELECT  *
      FROM    tags
    `;

    const params: any[] = [];

    database.all<TagModel>(sql, params, (_err, rows) => callback(rows));
  },

  create: (tag: TagModel, callback: (lastID?: number) => void) => {
    const sql = `
      INSERT INTO tags (name)
      VALUES      (?)
    `;

    const params = [
      tag.name
    ];

    database.run(sql, params, function(_err) {
      callback(this?.lastID);
    });
  },

  update: (id: number, tag: TagModel, callback: (changes?: number) => void) => {
    const sql = `
      UPDATE  tags
      SET     ?

      WHERE   id = ?
    `;

    const params = [
      tag.name,
      tag.id ?? id
    ];

    database.run(sql, params, function(_err) {
      callback(this?.changes);
    });
  },

  delete: (id: number, callback: (changes?: number) => void) => {
    const sql = ``;

    const params = [ id ];

    database.run(sql, params, function(_err) {
      callback(this?.changes);
    });
  },

  listByPage: (pageID: number, callback: (tags: TagModel[]) => void) => {
    const sql = `
      SELECT      tags.*
      FROM        tags
      INNER JOIN  page_tags ON tags.id = page_tags.tag_id
      WHERE       page_tags.page_id = ?
    `;

    const params = [ pageID ];

    database.all<TagModel>(sql, params, (_err, rows) => callback(rows));
  },
}

export default tagsRepository;