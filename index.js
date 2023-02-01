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

// Conexion con el servidor mongoose
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/playrest_v3", {
  useNewUrlParser: true,
});
//mongoose.connect('mongodb://localhost/juegos', { useNewUrlParser: true, useUnifiedTopology: true });
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
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(methodOverride("_method"));
servidor.use(express.static('./public/uploads'));
app.use(
  session({ secret: "mysecretkey", resave: true, saveUninitialized: true })
);

//Se asocian los enrutadores
app.use("/admin", juegosRouter);
app.use("/", publicoRouter);
app.use("/auth", authRouter);

// Puesta en marcha del servidor
app.listen(8080);
console.log("Listening on port 8080");

require("./utils/generar_usuarios");
require("./utils/generar_juegos");

