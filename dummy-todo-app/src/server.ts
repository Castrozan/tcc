// ESM import style, see tsconfig and package.json
import express, { Request, Response } from 'express';
import AppConstants from './app-constants.js';
import { router as ormRouter } from './example-domain/routes/index.js';
import config from './config/index.js';

const app = express();
app.use(express.json());

// Register ORM/API routes
app.use(AppConstants.API_PREFIX, ormRouter);

// Health check route
app.get('/alive', async (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Server is running'
    });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server if run directly
if (process.env.NODE_ENV !== 'test') {
    app.listen(config.port, () => {
        console.log(`App is running at http://localhost:${config.port}`);
    });
}

export default app;
