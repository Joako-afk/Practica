// src/config/db.js
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Creamos un "pool" de conexiones a la base de datos
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Verificamos la conexión al iniciar el servidor
pool.connect()
  .then(() => console.log(" Conexión exitosa a PostgreSQL"))
  .catch((err) => console.error(" Error al conectar con PostgreSQL:", err));
