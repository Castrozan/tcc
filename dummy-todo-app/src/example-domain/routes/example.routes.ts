import { Router } from 'express';
import { ExampleController } from '../controllers/example.controller.js';

const router = Router();
const controller = new ExampleController();

router.get('/hello', (req, res) => controller.hello(req, res));

export { router };
