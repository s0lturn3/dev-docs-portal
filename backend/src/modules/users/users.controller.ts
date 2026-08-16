import { Request, Response, Router } from 'express';
import UserModel from '../../models/user.model';
import usersRepository from './users.repository';


// End Regions

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieves a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     example: johndoe@email.com
 *                   password_hash:
 *                     type: string
 *                     example: password-hash-123
 *                   created_at:
 *                     type: Date
 *                     example: 2026-02-01
*/
export function getUsers(req: Request, res: Response) {
  usersRepository.list((users) => {
    return res.json(users);
  });
}

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieves a specific user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: johndoe@email.com
 *                 password_hash:
 *                   type: string
 *                   example: password-hash-123
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 */
export function getUser(req: Request, res: Response) {
  const id = +req.params.id;

  if (!id) return res.status(400).send();

  usersRepository.get(id, (user) => {
    if (!user) return res.status(404).send();
    return res.json(user);
  });
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Creates a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password_hash
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Smith
 *               email:
 *                 type: string
 *                 example: jane@email.com
 *               password_hash:
 *                 type: string
 *                 example: hashed-password-456
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
export function createUser(req: Request, res: Response) {
  const user: UserModel = req.body;

  if (!user) return res.status(400).send();

  usersRepository.create(user, (lastID) => {
    if (!lastID || lastID == 0) return res.status(500).send();
    
    return res.status(201).location(`/${lastID}`).send();
  });
}

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Updates an existing user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Updated
 *               email:
 *                 type: string
 *                 example: johnupdated@email.com
 *     responses:
 *       204:
 *         description: User updated successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Deletes a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Internal server error
 */
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