import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const DOMINIOS_PERMITIDOS = [
  "cecinasllanquihue.cl",
  "gamo.cl",
  "modinger.cl",
  "cecinas.com",
];

export const crearUsuario = async (req, res) => {
  try {
    const { nombre, apellido, rut, email, password, departamento } = req.body;

    if (!nombre || !apellido || !rut || !email || !password || !departamento) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const dominio = email.split("@")[1]?.toLowerCase();
    if (!dominio || !DOMINIOS_PERMITIDOS.includes(dominio)) {
      return res.status(400).json({
        message: "El correo no pertenece a un dominio permitido.",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const rolRes = await pool.query(
      "SELECT id_rol FROM rol WHERE nombre = 'solicitante' LIMIT 1"
    );
    const idRol = rolRes.rows[0]?.id_rol || 1;

    const result = await pool.query(
      `INSERT INTO usuario 
      (rut, nombre, apellido, correo, contrasena, departamento, rol)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [rut, nombre, apellido, email, hash, departamento, idRol]
    );

    res.status(201).json({
      message: "Usuario creado correctamente",
      usuario: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { rut, password } = req.body;

    if (!rut || !password) {
      return res
        .status(400)
        .json({ message: "RUT y contraseña son requeridos" });
    }

    const result = await pool.query(
      "SELECT * FROM usuario WHERE rut = $1",
      [rut]
    );
    const usuario = result.rows[0];

    if (!usuario) {
      // Mensaje menos obvio: no decimos "usuario no encontrado"
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrectos" });
    }

    const coincide = await bcrypt.compare(password, usuario.contrasena);
    if (!coincide) {
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { rut: usuario.rut, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      usuario: {
        rut: usuario.rut,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        departamento: usuario.departamento,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
