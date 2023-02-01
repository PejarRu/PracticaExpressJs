/**
 * Fichero generar_usuarios.js: Archivo de 
 * utilidad que genera 2 usuario basicos para 
 * comprobar la funcionalidad de la app
 */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Usuario = require(__dirname + "/../models/usuario");
Usuario.collection.drop();

new Usuario({
  login: "maycalle",
  password: "maycalle",
}).save();

new Usuario({
  login: "rosamaria",
  password: "rosamaria",
}).save();

Usuario.find().then((result) => {
  console.log(result);
});
