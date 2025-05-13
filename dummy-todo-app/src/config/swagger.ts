import swaggerJSDoc from 'swagger-jsdoc';
import packageJson from '../../package.json' assert { type: 'json' };

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Todo App API Documentation',
            version: packageJson.version,
            description: 'Documentation for the Todo App API',
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            },
            contact: {
                name: 'Lucas Zanoni',
                email: 'castro.lucas290@gmail.com',
                url: 'https://github.com/Castrozan'
            }
        },
        servers: [
            {
                url: '/api',
                description: 'API Server'
            }
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    required: ['name', 'email', 'password_hash'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'The auto-generated id of the user'
                        },
                        name: {
                            type: 'string',
                            description: 'The name of the user'
                        },
                        email: {
                            type: 'string',
                            description: 'The email of the user'
                        },
                        password_hash: {
                            type: 'string',
                            description: 'The hashed password of the user'
                        }
                    },
                    example: {
                        id: 1,
                        name: 'John Doe',
                        email: 'john.doe@example.com',
                        password_hash: 'hashedpassword123'
                    }
                },
                UserCreateRequest: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: {
                            type: 'string',
                            description: 'The name of the user'
                        },
                        email: {
                            type: 'string',
                            description: 'The email of the user'
                        },
                        password: {
                            type: 'string',
                            description: 'The password of the user'
                        }
                    },
                    example: {
                        name: 'John Doe',
                        email: 'john.doe@example.com',
                        password: 'password123'
                    }
                },
                Error: {
                    type: 'object',
                    required: ['success', 'message'],
                    properties: {
                        success: {
                            type: 'boolean',
                            description: 'Indicates if the request was successful',
                            example: false
                        },
                        message: {
                            type: 'string',
                            description: 'Error message',
                            example: 'User not found'
                        }
                    }
                }
            },
            responses: {
                BadRequest: {
                    description: 'Bad request',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                NotFound: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                InternalServerError: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/**/*.routes.ts', './src/**/*.controller.ts']
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
