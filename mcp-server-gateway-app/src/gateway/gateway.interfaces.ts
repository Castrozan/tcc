export interface BthJwtPayload {
    scopes: string[];
    client: {
        name: string;
        attributes: {
            entidade: string;
            database: string;
            sistema: string;
            exigeOrigemGateway: string;
            readOnly: string;
        };
        client_id: string;
    };
    user: {
        id: string;
        access: {
            systemId: string;
            entityId: string;
            databaseId: string;
            userId: string;
        };
    };
    expiresIn: number;
    iss: string;
    aud: string;
    iat: number;
    exp: number;
}

/**
 * Representa o contexto de uma aplicação da Betha.
 *
 * @interface BthContext
 *
 * @property {string} database - O identificador do banco de dados sendo acessado.
 * @property {string} entity - O identificador da entidade dentro do banco de dados.
 * @property {string} system - O identificador do sistema.
 */
export interface BthContext {
    database: string;
    entity: string;
    system: string;
}
