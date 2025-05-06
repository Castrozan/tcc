import { Config } from './types.js';
import dotenv from 'dotenv';

const result = dotenv.config();
if (result.error) {
    console.log('\t.env nao encontrado, usando development!\n');
}

const configs: Record<string, Config> = {
    // Se não haver .env no projeto, esses valores padrão serão utilizados
    // para garantir execução imediata como exemplo
    development: {
        port: Number(process.env.PORT) || 3000,
        jwt: {
            jwksUri:
                process.env.JWKS_URI ||
                'https://plataforma-authentication-jwks.test.betha.cloud/api/v1/keys',
            cache: {
                maxEntries: Number(process.env.JWKS_CACHE_MAX_ENTRIES) || 3,
                ageMs: Number(process.env.JWKS_CACHE_AGE) || 14400000
            }
        },
        cache: {
            inMemory: {
                ttlSeconds: Number(process.env.IN_MEMORY_CACHE_TTL) || 3600,
                maxKeys: Number(process.env.IN_MEMORY_CACHE_MAX_KEYS) || 1000
            },
            redis: {
                enabled: process.env.USE_REDIS === 'true',
                url: process.env.REDIS_URL || 'redis://localhost:6379',
                ttl: process.env.CACHE_REDIS_TTL || '1 day'
            }
        },
        auth: {
            uri: process.env.AUTH_URI || 'http://localhost:3001/auth'
        }
    },

    test: {
        port: Number(process.env.PORT),
        jwt: {
            jwksUri: process.env.JWKS_URI,
            cache: {
                maxEntries: Number(process.env.JWKS_CACHE_MAX_ENTRIES),
                ageMs: Number(process.env.JWKS_CACHE_AGE)
            }
        },
        cache: {
            inMemory: {
                ttlSeconds: Number(process.env.IN_MEMORY_CACHE_TTL),
                maxKeys: Number(process.env.IN_MEMORY_CACHE_MAX_KEYS)
            },
            redis: {
                enabled: process.env.USE_REDIS === 'true',
                url: process.env.REDIS_URL,
                ttl: process.env.CACHE_REDIS_TTL
            }
        },
        auth: {
            uri: process.env.AUTH_URI
        }
    },

    production: {
        port: Number(process.env.PORT),
        jwt: {
            jwksUri: process.env.JWKS_URI,
            cache: {
                maxEntries: Number(process.env.JWKS_CACHE_MAX_ENTRIES),
                ageMs: Number(process.env.JWKS_CACHE_AGE)
            }
        },
        cache: {
            inMemory: {
                ttlSeconds: Number(process.env.IN_MEMORY_CACHE_TTL),
                maxKeys: Number(process.env.IN_MEMORY_CACHE_MAX_KEYS)
            },
            redis: {
                enabled: process.env.USE_REDIS === 'true',
                url: process.env.REDIS_URL,
                ttl: process.env.CACHE_REDIS_TTL
            }
        },
        auth: {
            uri: process.env.AUTH_URI
        }
    }
};

const environment = process.env.NODE_ENV ?? 'development';
const config: Config = configs[environment] || configs.development;

export default config;
