import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { jest } from '@jest/globals';
import { GatewayController } from '../gateway.controller.js';
import { GatewayService } from '../gateway.service.js';
import { AuthImpl } from '../auth/auth.impl.js';

describe('Gateway routes', () => {
    let secretKey: string;
    let mockGatewayService: jest.Mocked<GatewayService>;
    let mockAuthImpl: jest.Mocked<AuthImpl>;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let controller: GatewayController;

    beforeAll(() => {
        secretKey = 'test-secret-key-256-bits-long';
    });

    beforeEach(() => {
        mockGatewayService = {
            getContext: jest.fn()
        } as unknown as jest.Mocked<GatewayService>;

        mockAuthImpl = {
            auth: jest.fn()
        } as unknown as jest.Mocked<AuthImpl>;

        req = {
            headers: {}
        } as unknown as Partial<Request>;

        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn()
        } as unknown as Partial<Response>;

        controller = new GatewayController(mockGatewayService, mockAuthImpl);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should return 200 for a valid token', async () => {
        const payload = { user: 'test-user' };
        const token = jwt.sign(payload, secretKey, { algorithm: 'HS256' });

        req.headers = { 'x-bth-gateway-id': token };

        jest.spyOn(GatewayService.prototype, 'getContext').mockImplementation(async () => {
            return {
                database: '1',
                entity: '1',
                system: '1'
            };
        });

        jest.spyOn(AuthImpl.prototype, 'auth').mockImplementation(async () => {
            return {
                uriRedirect: 'mockUriRedirect',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        });

        await controller.auth(req as Request, res as Response, jest.fn());

        expect(mockGatewayService.getContext).toHaveBeenCalledWith(token);
    });

    test('should return 422 for an invalid token', async () => {
        if (req.headers) {
            req.headers['x-bth-gateway-id'] = 'invalid-token';
        }

        await controller.auth(req as Request, res as Response, jest.fn());

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.anything()
            })
        );
    });

    test('should return 500 for unexpected errors', async () => {
        const payload = { user: 'test-user' };
        const token = jwt.sign(payload, secretKey, { algorithm: 'HS256' });

        req.headers = { 'x-bth-gateway-id': token };

        mockGatewayService.getContext.mockImplementationOnce(() => {
            throw new Error('Unexpected server error');
        });

        await controller.auth(req as Request, res as Response, jest.fn());

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: new Error('Unexpected server error'),
            message: 'Erro interno do servidor'
        });
    });
});
