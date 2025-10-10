import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ranked Vote API',
      version: '1.0.0',
      description: 'Sistema de votación comunitaria para eventos culturales - API Multi-Tenant',
      contact: {
        name: 'Dev Night Talk Villahermosa',
        email: 'devnighttalk@gmail.com',
        url: 'https://github.com/dev-night-talk/vota-flor'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.votaflor.com' 
          : `http://localhost:${process.env.PORT || 5001}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        TenantHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'X-Tenant-Slug',
          description: 'Tenant identifier for multi-tenant support'
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
            error: {
              type: 'string',
              example: 'Detailed error information'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation successful'
            }
          }
        },
        Candidate: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            name: {
              type: 'string',
              example: 'Juan Pérez'
            },
            municipality: {
              type: 'string',
              example: 'Villahermosa'
            },
            photoUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/photo.jpg'
            },
            bio: {
              type: 'string',
              example: 'Descripción del candidato'
            },
            order: {
              type: 'integer',
              example: 1
            },
            active: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            },
            _count: {
              type: 'object',
              properties: {
                votes: {
                  type: 'integer',
                  example: 25
                }
              }
            }
          }
        },
        Vote: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            voterId: {
              type: 'string',
              example: 'voter123'
            },
            candidateId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            rank: {
              type: 'integer',
              minimum: 1,
              example: 1
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        Event: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            name: {
              type: 'string',
              example: 'Festival Cultural 2024'
            },
            description: {
              type: 'string',
              example: 'Descripción del evento'
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-31T23:59:59.000Z'
            },
            active: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        Result: {
          type: 'object',
          properties: {
            candidateId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            candidateName: {
              type: 'string',
              example: 'Juan Pérez'
            },
            totalVotes: {
              type: 'integer',
              example: 150
            },
            rank: {
              type: 'integer',
              example: 1
            },
            percentage: {
              type: 'number',
              format: 'float',
              example: 35.5
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            currentPage: {
              type: 'integer',
              example: 1
            },
            totalPages: {
              type: 'integer',
              example: 5
            },
            limit: {
              type: 'integer',
              example: 10
            },
            hasNextPage: {
              type: 'boolean',
              example: true
            },
            hasPrevPage: {
              type: 'boolean',
              example: false
            },
            nextPage: {
              type: 'integer',
              nullable: true,
              example: 2
            },
            prevPage: {
              type: 'integer',
              nullable: true,
              example: null
            }
          }
        }
      }
    },
    security: [
      {
        TenantHeader: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(swaggerOptions);

// Swagger UI options
const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Ranked Vote API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    docExpansion: 'none',
    filter: true,
    showRequestHeaders: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  }
};

export { specs, swaggerUi, swaggerUiOptions };
