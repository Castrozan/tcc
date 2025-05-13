import express, { Application, Request, Response } from 'express';
import AppConstants from './app-constants.js';
import { router as ormRouter } from './example-domain/routes/index.js';
import { router as userRouter } from './user/routes/index.js';
import { router as swaggerRouter } from './routes/swagger.routes.js';
import { createErrorHandlingMiddleware } from './user/exceptions/error-handler.js';

const app: Application = express();

app.use(express.json());

// API routes
app.use(AppConstants.API_PREFIX, ormRouter);
app.use(AppConstants.API_PREFIX, userRouter);

// Swagger documentation
app.use(AppConstants.API_PREFIX, swaggerRouter);

app.use('/alive', (_req: Request, res: Response): void => {
    res.status(200).send('yes');
});

app.use(createErrorHandlingMiddleware());

export default app;
