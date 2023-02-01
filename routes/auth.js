/**
 * Fichero routes/auth.js: Archivo con las
 * peticiones al servidor de 
 * (GET)/auth/login, 
 * (POST)/auth/login, 
 * (GET)/auth/logout, 
 * (GET)/auth/register, 
 * (POST)/auth/register, 
 */
const express = require("express");
const router = express.Router();
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const authMiddleware = require("../utils/middleware");
//Load schemas
let Usuario = require("../models/usuario");

// SETUP SESSION
router.use(
  session({
    secret: "mysecretkey",
    resave: true,
    saveUninitialized: false,
    expires: new Date(Date.now() + 30 * 60 * 1000),
  })
);

// SETUP BODY PARSER
router.use(bodyParser.urlencoded({ extended: true }));

// GET /auth/login
router.get("/login", (req, res) => {
  Usuario.find((err, result) => {
    if (err) console.error(err);
    console.log(result);
  });
  res.render("auth_login");
});

// POST /auth/login
router.post("/login", (req, res) => {
  // Recoger login y password de la petición
  const login = req.body.login;
  const password = req.body.password;

  // Buscar usuario con el mismo login en la base de datos
  Usuario.findOne({ login: login }, async (err, usuario) => {
    if (err) {
      console.log(err);
      return res.render("auth_login", { error: "Error de aplicacion" });
    }
    // Si el usuario no existe, devolver mensaje de error
    if (!usuario) {
      console.log("\nusuario NO existe\n");
      return res.render("auth_login", { error: "Usuario incorrecto" });
    }

    // Comparar contraseñas
    const isValid = await usuario.isValidPassword(password);

    if (!isValid) {
      console.log("\ncontraseña NOT ok\n");
      return res.render("auth_login", {
        error: "Usuario incorrecto(contraseña)",
      });
    }

    // Almacenar login del usuario en sesión
    req.session.usuario = usuario;
    console.log("\nSession: " + req.session.usuario);
    // Redirigir a la ruta base del enrutador de juegos
    res.redirect("/admin/juegos");
  });
});

// GET /auth/login
router.get("/register", (req, res) => {
  Usuario.find((err, result) => {
    if (err) console.error(err);
    console.log(result);
  });
  console.log("########### REGISTER ###########");

  res.render("auth_login", { sendTo: "/auth/register", action: "Registrarme" });
});

// POST /auth/register
router.post("/register", (req, res) => {
  console.log("########### REGISTER ###########");
  // Recoger login y password de la petición
  const login = req.body.login;
  const password = req.body.password;

  // Encriptar la contraseña con bcrypt
  bcrypt.hash(password, 10, (err, passwordhHash) => {
    if (err) {
      console.log(err);
      return res.render("auth_login", {
        error: "Error de aplicacion al registrar",
      });
    }
    // Crear nuevo usuario con los datos recogidos de la petición
    const nuevoUsuario = new Usuario({
      login: login,
      password: passwordhHash,
    });

    // Guardar usuario en la base de datos
    nuevoUsuario.save((err) => {
      if (err) {
        console.log(err);
        return res.render("auth_login", {
          error: "Error de aplicacion al registrar",
          sendTo: "/auth/register",
          action: "Registrarme",
        });
      }
      Usuario.find((err, result) => {
        if (err) console.error(err);
        console.log(result);
      });
      // Almacenar login del usuario en sesión
      req.session.usuario = nuevoUsuario;

      // Redirigir a la ruta base del enrutador de juegos
      res.redirect("/admin/juegos");
    });
  });
});
// GET /auth/logout
router.get("/logout", authMiddleware, (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
