import { serve } from '@hono/node-server';
import app from './infrastructure/web/open-api/server';
import config from './config/index.js';
import { cleanupDatabase, initializeDatabase } from './infrastructure/database/init';

initializeDatabase().catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
});

console.log(`Server starting on port ${config.port}...`);
serve({
    fetch: app.fetch,
    port: Number(config.port)
});

// Handle application shutdown
process.on('SIGINT', () => {
    console.log('Application shutting down...');
    cleanupDatabase();
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.log('Application shutting down...');
    cleanupDatabase();
    process.exit(0);
});

export default app;
