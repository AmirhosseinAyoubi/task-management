import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Jobs API',
        version: '1.0.0',
        description: 'A comprehensive API for job management and applications',
        contact: {
            name: 'API Support',
            email: 'support@jobsapi.com'
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
        }
    },
    servers: [
        {
            url: `http://localhost:${config.port || 3000}/api/v1`,
            description: 'Development server'
        },
        {
            url: 'https://api.jobsapi.com',
            description: 'Production server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            Error: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: false
                    },
                    message: {
                        type: 'string',
                        example: 'Error message'
                    },
                    errors: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                field: { type: 'string' },
                                message: { type: 'string' }
                            }
                        }
                    }
                }
            },
            Success: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: true
                    },
                    message: {
                        type: 'string',
                        example: 'Operation successful'
                    },
                    data: {
                        type: 'object'
                    }
                }
            }
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ]
};

const options = {
    swaggerDefinition,
    apis: [
        './src/routes/*.ts',
        './src/controllers/*.ts',
        './src/models/*.ts'
    ],
    failOnErrors: true,
    definition: {
        openapi: '3.0.0'
    }
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;