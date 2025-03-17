import jwt, { JwtPayload } from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import { GatewayService } from '../gateway.service.js';
import { InvalidTokenException } from '../gateway.errors.js';

jest.mock('jwks-rsa');
jest.mock('jsonwebtoken');

describe('GatewayService', () => {
    const mockJwksClient = {
        getSigningKey: jest.fn()
    };

    beforeAll(() => {
        (jwksRsa as unknown as jest.Mock).mockImplementation(() => mockJwksClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should validate a JWT successfully and return auth credentials', async () => {
        const mockPublicKey = 'mock-public-key';
        const mockJwtPayload: JwtPayload = {
            client: {
                attributes: {
                    database: '1',
                    entidade: '1',
                    sistema: '1'
                }
            }
        };

        const token = 'mock-jwt-token';
        const decodedHeader = { kid: 'test-kid', alg: 'RS256' };

        mockJwksClient.getSigningKey.mockResolvedValue({
            getPublicKey: () => mockPublicKey
        });

        (jwt.decode as jest.Mock).mockReturnValue({ header: decodedHeader });
        (jwt.verify as jest.Mock).mockReturnValue(mockJwtPayload);

        const gatewayService = new GatewayService();
        const result = await gatewayService.getContext(token);

        expect(result).toEqual({
            database: mockJwtPayload.client.attributes.database,
            entity: mockJwtPayload.client.attributes.entidade,
            system: mockJwtPayload.client.attributes.sistema
        });
        expect(mockJwksClient.getSigningKey).toHaveBeenCalledWith('test-kid');
        expect(jwt.verify).toHaveBeenCalledWith(token, mockPublicKey, { algorithms: ['RS256'] });
    });

    test('should throw InvalidTokenException on invalid JWT', async () => {
        const mockPublicKey = 'mock-public-key';
        const token = 'mock-jwt-token';
        const gatewayService = new GatewayService();

        mockJwksClient.getSigningKey.mockResolvedValue({
            getPublicKey: () => mockPublicKey
        });

        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new InvalidTokenException('Invalid JWT');
        });

        await expect(gatewayService.getContext(token)).rejects.toThrow(InvalidTokenException);
        expect(mockJwksClient.getSigningKey).toHaveBeenCalledWith(expect.any(String));
        expect(jwt.verify).toHaveBeenCalledWith(token, mockPublicKey, { algorithms: ['RS256'] });
    });
});
