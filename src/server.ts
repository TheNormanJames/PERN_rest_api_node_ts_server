import express from 'express';
import colors from 'colors';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec, { swaggerUiOptions } from './config/swagger';
import router from './router';
import db from './config/db';

export async function connnectDB() {
  try {
    await db.authenticate();
    db.sync();
    // console.log(colors.blue('Conexión exitosa a la Db'));
  } catch (error) {
    // console.log(error);
    console.log(colors.red.bold('Error al conectar la base de datos'));
  }
}

connnectDB();

// Instancia de Express
const server = express();

// Leer datos de formularios
server.use(express.json());

server.use('/api/products', router);

// Docs
server.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

export default server;
