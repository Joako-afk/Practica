import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ==============================
// DOMINIOS PERMITIDOS (EDITA AQUÍ)
// ==============================
const DOMINIOS_PERMITIDOS = [
  "cecinasllanquihue.cl",
  "gamo.cl",
  "modinger.cl",
  "cecinas.com",
  // agrega más si necesitas
];

export const crearUsuario = async (req, res) => {
  try {
    console.log("Datos recibidos en backend:", req.body);

    const { nombre, apellido, rut, email, password, departamento } = req.body;

    if (!nombre || !apellido || !rut || !email || !password || !departamento) {
      console.log("Faltan campos:", req.body);
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // ==============================
    // ✅ VALIDAR DOMINIO DEL CORREO
    // ==============================
    const dominio = email.split("@")[1]?.toLowerCase();
    if (!dominio || !DOMINIOS_PERMITIDOS.includes(dominio)) {
      return res.status(400).json({
        message: "El correo no pertenece a un dominio permitido.",
      });
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(password, 10);

    // Obtener rol solicitante por defecto
    const rolRes = await pool.query(
      "SELECT id_rol FROM rol WHERE nombre = 'solicitante' LIMIT 1"
    );
    const idRol = rolRes.rows[0]?.id_rol || 1;

    // Insertar usuario
    const result = await pool.query(
      `INSERT INTO usuario 
      (rut, nombre, apellido, correo, contrasena, departamento, rol)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [rut, nombre, apellido, email, hash, departamento, idRol]
    );

    console.log("Usuario insertado:", result.rows[0]);

    res.status(201).json({
      message: "Usuario creado correctamente",
      usuario: result.rows[0],
    });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { rut, password } = req.body;

    if (!rut || !password) {
      return res.status(400).json({ message: "RUT y contraseña son requeridos" });
    }

    // Buscar usuario por RUT
    const result = await pool.query("SELECT * FROM usuario WHERE rut = $1", [rut]);
    const usuario = result.rows[0];

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseña
    const coincide = await bcrypt.compare(password, usuario.contrasena);
    if (!coincide) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Crear token
    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        rut: usuario.rut,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        departamento: usuario.departamento,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
