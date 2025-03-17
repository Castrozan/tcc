import httpProxy from 'express-http-proxy';
import { Request, Response } from 'express';
import { header, validationResult } from 'express-validator';
import { GatewayService } from './gateway.service.js';
import AppConstants from '../app-constants.js';
import { AuthCredentials } from './auth/auth.interfaces.js';
import { GatewayValidationException, InvalidTokenException } from './gateway.errors.js';
import { AuthProvider } from './auth/auth.provider.js';

/**
 * Controller class for handling gateway-related functionality.
 *
 * @param gatewayService The gateway service.
 */
class GatewayController {
    /**
     * Constructor for the GatewayController class.
     *
     * @param gatewayService The gateway service.
     */
    constructor(
        private readonly gatewayService: GatewayService,
        private readonly authImpl: AuthProvider
    ) {}

    /**
     * Authenticates the incoming request by verifying the JWT token and applying auth credentials.
     * If authentication is successful, the request is proxied to the partner application.
     */
    public async auth(req: Request, res: Response, next: any): Promise<void> {
        try {
            await this.verifyJwtToken(req);
            const token = req.headers[AppConstants.BTH_GATEWAY_ID_HEADER] as string;

            const context = await this.gatewayService.getContext(token);
            const credentials = await this.authImpl.auth(context);

            this.applyAuthCredentialsToRequest(req, credentials);
            // Proxy the request to the partner application
            this.proxyRequest(req, res, next, credentials.uriRedirect);
        } catch (error) {
            if (
                error instanceof GatewayValidationException ||
                error instanceof InvalidTokenException
            ) {
                res.status(error.statusCode).json({ error: error });
            } else {
                console.error(error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        }
    }

    /**
     * Validates the JWT token in the request header.
     *
     * @param req - The request object.
     * @throws {GatewayValidationException} If the token is invalid.
     */
    private async verifyJwtToken(req: Request): Promise<void> {
        await header(AppConstants.BTH_GATEWAY_ID_HEADER, 'Token JWT invalido')
            .exists()
            .isJWT()
            .run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new GatewayValidationException('Validacao falhou', errors.array());
        }
    }

    /**
     * Applies auth credentials to the incoming request.
     *
     * @param req - The request object.
     * @param credentials - The auth credentials.
     */
    private applyAuthCredentialsToRequest(req: Request, credentials: AuthCredentials): void {
        req.headers = {
            ...req.headers,
            ...credentials.headers
        };
        req.method = credentials.method;
    }

    /**
     * Proxies the request to the partner application.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     * @param uriRedirect - The URI to redirect to.
     */
    private proxyRequest(req: Request, res: Response, next: any, uriRedirect: string): void {
        httpProxy(uriRedirect, {
            proxyReqPathResolver: () => req.originalUrl
        })(req, res, next);
    }
}

export { GatewayController };
