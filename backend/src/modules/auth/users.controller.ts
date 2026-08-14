import { Request, Response, Router } from 'express';
import usersRepository from '../../db/repositories/users.repository';


// Endregions
export function getUser(req: Request, res: Response) {
  const id = +req.params.id;

  usersRepository.get(id, (user) => {
    if (id) {
      return res.json(user);
    }
    else {
      return res.status(400).send();
    }
  });
}

export function getUsers(req: Request, res: Response) {
  usersRepository.getList((users) => {
    return res.json(users);
  });
}

export function createUser(req: Request, res: Response) {

}

export function updateUser(req: Request, res: Response) {

}

export function deleteUser(req: Request, res: Response) {

}


// Controller
class UsersController {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', getUsers);
    this.router.get('/:id', getUser);

    this.router.post('/', createUser);
    this.router.put('/:id', updateUser);
    this.router.delete('/:id', deleteUser);
  }
}

export default new UsersController().router;