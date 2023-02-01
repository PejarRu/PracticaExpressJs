/**
 * Fichero middleware.js: Archivo de 
 * utilidad que en el que se desarrolla
 * los midlewres de validacion de rutas.
 * Por ejemplo, la validacion de usuario administrador
 */
let authMiddleware = (req, res, next) => {
  if (req.session.usuario) {
    next();
  } else {
    console.log('\nno sesion. Session needed\n');
    res.redirect("/auth/login");
  }
};

module.exports = authMiddleware;
