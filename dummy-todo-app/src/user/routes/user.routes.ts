import { UserController } from '../controllers/user.controller.js';
import { Router } from 'express';

const router = Router();
const controller = new UserController();

router.post('/', (req, res) => controller.createUser(req, res));
router.get('/', (req, res) => controller.listUsers(req, res));
router.get('/:id', (req, res) => controller.getUser(req, res));
router.put('/:id', (req, res) => controller.updateUser(req, res));
router.delete('/:id', (req, res) => controller.deleteUser(req, res));

export { router };
