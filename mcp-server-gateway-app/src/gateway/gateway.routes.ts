import { Request, Response, Router } from 'express';
import { GatewayController } from './gateway.controller.js';
import { GatewayService } from './gateway.service.js';
import { AuthImpl } from './auth/auth.impl.js';
import { CachingAuthProvider } from './auth/auth.cache.decorator.js';

const router = Router();
const gatewayService = new GatewayService();
const authProvider = new CachingAuthProvider(new AuthImpl());
const gatewayController = new GatewayController(gatewayService, authProvider);

/**
 * Routes for the gateway
 */
router.all('*', (req: Request, res: Response, next: any) => gatewayController.auth(req, res, next));
export { router };
