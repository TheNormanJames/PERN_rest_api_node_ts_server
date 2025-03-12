import express from "express";
import db from "./config/db";
import router from "./router";
import colors from "colors";

async function connnectDB() {
  try {
    await db.authenticate();
    db.sync();
    console.log(colors.blue("Conexión exitosa a la Db"));
  } catch (error) {
    console.log(error);
    console.log(colors.red.bold("Error al conectar la base de datos"));
  }
}

connnectDB();

const server = express();

server.use("/api/products", router);

export default server;
