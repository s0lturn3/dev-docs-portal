import UserModel from "../../models/user.model";
import database from "../database";

const usersRepository = {
  get: (id: number, callback: (users: UserModel) => void) => {
    const sql = 'SELECT * FROM users WHERE id = ?';

    const params = [ id ];

    database.get(sql, params, (_err, user) => callback(user as UserModel));
  },
  getList: (callback: (users: UserModel[]) => void) => {
    const sql = 'SELECT * FROM users';

    const params: UserModel[] = [];

    database.all(sql, params, (_err, users) => callback(users as UserModel[]));
  }
};

export default usersRepository;