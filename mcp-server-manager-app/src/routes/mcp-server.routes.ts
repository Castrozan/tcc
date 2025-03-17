import { Request, Response, Router } from 'express';
import { McpServerController } from '../controllers/mcp-server.controller.js';
import { ConfigManager } from '../config/configManager.js';

const router = Router();
const configManager = new ConfigManager();
const controller = new McpServerController(configManager);

/**
 * Routes for MCP server management
 */
router.get('/servers', async (req: Request, res: Response, next: any) => {
    await controller.getServers(req, res, next);
});

router.put('/servers', async (req: Request, res: Response, next: any) => {
    await controller.putServer(req, res, next);
});

router.delete('/servers/:name', async (req: Request, res: Response, next: any) => {
    await controller.deleteServer(req, res, next);
});

export { router };
