const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require('dotenv').config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "KHCN",
      version: "1.0.0",
      description: "API for user authentication",
    },
    servers: [
      {
        url: "https://database-ro16.onrender.com",

      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["routes/*.js"], // Đường dẫn đến các file chứa định nghĩa API
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
