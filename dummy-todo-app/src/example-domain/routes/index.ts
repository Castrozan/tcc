import { Router } from 'express';
import { router as exampleRouter } from './example.routes.js';

const router = Router();

router.use('/example', exampleRouter);

export { router };
