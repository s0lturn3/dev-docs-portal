import database from "../../db/database";
import UserModel from "../../models/user.model";

const usersRepository = {
  get: (id: number, callback: (user: UserModel) => void) => {
    const sql = `
      SELECT  *
      FROM    users
      WHERE   id = ?
    `;

    const params = [ id ];

    database.get<UserModel>(sql, params, (_err, user) => callback(user));
  },

  list: (callback: (users: UserModel[]) => void) => {
    const sql = `
      SELECT  *
      FROM    users
    `;

    const params: UserModel[] = [];

    database.all<UserModel>(sql, params, (_err, users) => callback(users));
  },

  create: (user: UserModel, callback: (lastID?: number) => void) => {
    const sql = `
      INSERT INTO users
        ( email,
          password_hash,
          name,
          created_at  )
      VALUES
        ( ?,
          ?,
          ?,
          ? )
    `;

    const params = [
      user.email,
      user.password_hash,
      user.name,
      new Date()
    ];

    database.run(sql, params, function(_err) {
      callback(this?.lastID);
    });
  },

  update: (id: number, user: UserModel, callback: (changes?: number) => void) => {
    const sql = `
      UPDATE  users
      SET     email = ?,
              name = ?

      WHERE   id = ?
    `;

    const params = [
      user.email,
      user.name,
      user.id ?? id
    ];

    database.run(sql, params, function(_err) {
      callback(this?.changes);
    });
  },

  delete: (id: number, callback: (changes?: number) => void) => {
    const sql = `
      DELETE FROM users
      WHERE       id = ?
    `;

    const params = [ id ];

    database.run(sql, params, function(_err) {
      callback(this?.changes);
    });
  },
};

export default usersRepository;