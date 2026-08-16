import { Request, Response, Router } from 'express';
import usersRepository from '../../db/repositories/users.repository';
import UserModel from '../../models/user.model';


// Endregions
export function getUsers(req: Request, res: Response) {
  usersRepository.list((users) => {
    return res.json(users);
  });
}

export function getUser(req: Request, res: Response) {
  const id = +req.params.id;

  if (!id) return res.status(400).send();

  usersRepository.get(id, (user) => {
    if (!user) return res.status(404).send();
    return res.json(user);
  });
}

export function createUser(req: Request, res: Response) {
  const user: UserModel = req.body;

  if (!user) return res.status(400).send();

  usersRepository.create(user, (lastID) => {
    if (!lastID || lastID == 0) return res.status(500).send();
    
    return res.status(201).location(`/${lastID}`).send();
  });
}

export function updateUser(req: Request, res: Response) {
  const id = +req.params.id;
  const user: UserModel = req.body;

  if (!id) return res.status(400).send();
  if (!user) return res.status(400).send();

  usersRepository.update(id, user, (changes) => {
    if (!changes || changes == 0) return res.status(500).send();

    return res.status(204).send();
  });
}

export function deleteUser(req: Request, res: Response) {
  const id = +req.params.id;

  if (!id) return res.status(400).send();

  usersRepository.delete(id, (changes) => {
    if (!changes || changes == 0) return res.status(500).send();

    return res.status(204).send();
  });
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