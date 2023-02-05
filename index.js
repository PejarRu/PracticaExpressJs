/**
 * Fichero index.js: Archivo principal con require
 * de librerias y modulos principales, conexion con el
 * servidor y puesta en marcha en puerto especifico
 */
// Librerias y modulos
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nunjucks = require("nunjucks");
const session = require("express-session");
const methodOverride = require("method-override");

//Enrutadores
const juegosRouter = require("./routes/juegos");
const publicoRouter = require("./routes/publico");
const authRouter = require("./routes/auth");
//Middleware necesario
const authMiddleware = require("./utils/middleware");
juegosRouter.use(authMiddleware);
//Utitlidades
const generadorUsuarios = require("./utils/generar_usuarios");
const generadorJuegos = require("./utils/generar_juegos");

// Conexion con el servidor mongoose
mongoose.connect('mongodb://0.0.0.0:27017/juegos',
  { useNewUrlParser: true }).then(() => {
    //Generamos usuario y juegos para comprobar la funcionalidad de la aplicacion

    generadorUsuarios.reiniciarUsuarios();
    generadorJuegos.reiniciarJuegos();
  })
  .catch(error => console.error(error));;




// Servidor Express
const app = express();
//Se configura la autenticación basada en sesiones
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
  })
);
//Se configura el motor de plantillas Nunjucks
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});
app.set("view engine", "njk");

// Carga de middleware y demas
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/uploads', express.static(__dirname + '/public/uploads'));
app.use('/jsUtils', express.static(__dirname + '/utils'));
app.use(express.static(__dirname + '/public'));
//Se asocian los enrutadores
app.use("/", publicoRouter);
app.use("/admin/juegos", juegosRouter);
app.use("/auth", authRouter);



// Puesta en marcha del servidor
app.listen(8080);
console.log("Listening on port 8080");


