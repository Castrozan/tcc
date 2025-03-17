import config from './config/index.js';
import express from 'express';
import { router as mcpServerRoutes } from './routes/mcp-server.routes.js';

const app = express();
app.use(express.json());

// Routes
app.use('/api', mcpServerRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

/**
 * Start Express server.
 */
app.listen(config.port, () => {
    console.log(
        '\tApp is running at http://localhost:%d in %s mode',
        config.port,
        process.env.NODE_ENV
    );
    console.log('\tPress CTRL-C to stop\n');
});

export default app;
