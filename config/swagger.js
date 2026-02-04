const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Software Company API',
      version: '1.0.0',
      description: 'Dasturlar yaratadigan kompaniya sayti uchun to\'liq backend API. Node.js, Express va MongoDB bilan qurilgan.',
      contact: {
        name: 'API Support',
        email: 'support@yourcompany.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://your-production-url.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Xato xabari',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            next: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
              },
            },
            prev: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Foydalanuvchi autentifikatsiyasi va avtorizatsiyasi',
      },
      {
        name: 'Features',
        description: 'Kompaniya xizmatlari boshqaruvi',
      },
      {
        name: 'Products',
        description: 'Mahsulotlar va loyihalar',
      },
      {
        name: 'Team',
        description: 'Jamoa a\'zolari (Developers)',
      },
      {
        name: 'Technologies',
        description: 'Ishlatilgan texnologiyalar',
      },
      {
        name: 'Awards',
        description: 'Yutuqlar va mukofotlar',
      },
      {
        name: 'Testimonials',
        description: 'Mijozlar sharhlari',
      },
      {
        name: 'Contacts',
        description: 'Aloqa so\'rovlari',
      },
      {
        name: 'Attendance',
        description: 'Xodimlar davomat tizimi',
      },
      {
        name: 'Dashboard',
        description: 'Dashboard statistikasi va analytics',
      },
    ],
  },
  apis: ['./routes/*.js', './models/*.js'], // Path to API docs
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Software Company API Docs',
  }));

  // JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`📚 Swagger Docs: http://localhost:${process.env.PORT || 5000}/api-docs`);
};

module.exports = swaggerDocs;
