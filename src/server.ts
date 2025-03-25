import express from 'express';
import colors from 'colors';

import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec, { swaggerUiOptions } from './config/swagger';
import router from './router';
import db from './config/db';

export async function connnectDB() {
  try {
    await db.authenticate();
    db.sync();
  } catch (error) {
    // console.log(error);
    console.log(colors.red.bold('Error al conectar la base de datos'));
  }
}

connnectDB();

// Instancia de Express
const server = express();

// Permitir conexiones CORS
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error('Error en CORS'));
    }
  },
};

server.use(cors(corsOptions));

// Leer datos de formularios
server.use(express.json());

server.use(morgan('dev'));

server.use('/api/products', router);

// Docs
server.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

export default server;
