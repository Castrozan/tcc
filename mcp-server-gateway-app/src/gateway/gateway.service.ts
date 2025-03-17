import assert from 'assert';
import jwksRsa from 'jwks-rsa';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { InvalidTokenException } from './gateway.errors.js';
import { BthContext } from './gateway.interfaces.js';
import { BthJwtPayload } from './gateway.interfaces.js';
import config from '../config/index.js';

/**
 * The GatewayService class provides methods for authenticating requests to the
 * gateway service.
 */
class GatewayService {
    private jwksClient: jwksRsa.JwksClient;

    /**
     * Constructor for the GatewayService class.
     */
    constructor() {
        const { jwksUri } = config.jwt;
        const jwksCacheAge = config.jwt.cache.ageMs;
        const jwksCacheMaxEntries = config.jwt.cache.maxEntries;
        assert(jwksUri, 'ENV JWKS_URI nao esta definido');
        assert(jwksCacheAge, 'ENV JWKS_CACHE_AGE nao esta definido');
        assert(jwksCacheMaxEntries, 'ENV JWKS_CACHE_MAX_ENTRIES nao esta definido');

        this.jwksClient = jwksRsa({
            jwksUri,
            cache: true,
            cacheMaxEntries: jwksCacheMaxEntries,
            cacheMaxAge: jwksCacheAge
        });
    }

    /**
     * Extracts the context information from the JWT token.
     *
     * @param token - The JWT token to extract context from.
     * @returns The extracted context containing database, entity, and system.
     * @throws {InvalidTokenException} If the JWT is invalid or cannot be verified.
     */
    public async getContext(token: string): Promise<BthContext> {
        const jwtPayload = (await this.getJwtPayload(token)) as BthJwtPayload;

        return {
            database: jwtPayload.user.access.databaseId,
            entity: jwtPayload.user.access.entityId,
            system: jwtPayload.user.access.systemId
        };
    }

    /**
     * Validates the given JWT and returns the decoded payload.
     *
     * @param token - The JWT to validate.
     * @returns A promise that resolves to the decoded JWT payload if valid.
     * @throws An error if the token is invalid or cannot be verified.
     */
    public async getJwtPayload(token: string): Promise<JwtPayload> {
        const decodedHeader = jwt.decode(token, { complete: true });

        assert(
            decodedHeader?.header.kid,
            new InvalidTokenException('O header do token está sem a propriedade kid')
        );

        const signingKey = await this.getJwksSigningKey(decodedHeader.header.kid);

        try {
            return jwt.verify(token, signingKey, { algorithms: ['RS256'] }) as JwtPayload;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new InvalidTokenException('Falha na validacao do JWT: Token expirou', error);
            }
            throw error;
        }
    }

    /**
     * Obtains the public key from the JWKS endpoint.
     *
     * @param kid - The key ID to obtain.
     * @returns A promise that resolves to the public key.
     */
    private async getJwksSigningKey(kid: string): Promise<string> {
        return (await this.jwksClient.getSigningKey(kid)).getPublicKey();
    }
}

export { GatewayService };
