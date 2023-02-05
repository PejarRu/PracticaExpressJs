/**
 * Fichero generar_usuarios.js: Archivo de 
 * utilidad que genera 2 usuario basicos para 
 * comprobar la funcionalidad de la app
 */
const Usuario = require(__dirname + "/../models/usuario");
const bcrypt = require("bcrypt");

exports.reiniciarUsuarios = async function () {
  try {
    await Usuario.collection.drop();
    console.log('Colección de usuarios borrada');
  } catch (error) {
    console.error('########========########');
    console.error('Error al borrar la colección de usuarios');
    console.error(error);
    console.error('########========########');
  }
  const usuarios = [{ login: "maycalle", password: "maycalle" }, { login: "rosamaria", password: "rosamaria" }];
  
  for (let index = 0; index < usuarios.length; index++) {
    try {
      await new Usuario(usuarios[index]).save();
      console.log(`Usuario ${index} guardado`);
    } catch (error) {
      console.error('########========########');
      console.error('Error al guardar usuario');
      console.error(error);
      console.error('########========########');
    }
  }

  try {
    const result = await Usuario.find();
    console.log(result);
  } catch (error) {
    console.error('########========########');
    console.error('Error al buscar usuarios');
    console.error(error);
    console.error('########========########');
  }
};