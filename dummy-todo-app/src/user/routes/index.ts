import { Router } from 'express';
import { router as userRouter } from './user.routes.js';

const router = Router();

router.use('/users', userRouter);

export { router };
