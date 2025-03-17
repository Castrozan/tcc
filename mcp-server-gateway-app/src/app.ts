import express, { Application, Request, Response } from 'express';
import { router as gatewayRoutes } from './gateway/gateway.routes.js';

const app: Application = express();

// Health Check
app.use('/alive', (_req: Request, res: Response): void => {
    res.status(200).send('yes');
});

// API routes
app.all('*', gatewayRoutes);

export default app;
