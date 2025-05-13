import express, { Application, Request, Response } from 'express';
import AppConstants from './app-constants.js';
import { router as ormRouter } from './example-domain/routes/index.js';
import { router as userRouter } from './user/routes/index.js';

const app: Application = express();

app.use(express.json());

app.use(AppConstants.API_PREFIX, ormRouter);
app.use(AppConstants.API_PREFIX, userRouter);

app.use('/alive', (_req: Request, res: Response): void => {
    res.status(200).send('yes');
});

app.use((err: Error, _req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

export default app;
