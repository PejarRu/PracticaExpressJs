/**
 * Fichero routes/publico.js: Archivo con las
 * peticiones al servidor de /, /buscar, /juegos/:id:
 *      GET, POST,
 */
let Juego = require(__dirname + "/../models/juego.js");

const express = require("express");
let router = express.Router();

// Servicio de listado general
router.get("/", (req, res) => {
  console.log("Mostrando index");
  Juego.find()
    .then((juegos) => {
      if (juegos.length === 0) {
        res.render("publico_index", { message: "No se encontraron juegos" });
      } else {
        res.render("publico_index", { juegos });
      }
    })
    .catch((err) => {
      res.render("publico_error");
    });
});

router.get("/buscar", (req, res) => {
  console.log("Buscando '" + req.query.search + "'");
  Juego.find({})
    .then((juegos) => {
      console.log("\n \n \n  " + juegos);
      console.log("\n \n \n  ");
      let filteredJuegos = juegos.filter((juego) =>
        juego.nombre.includes(req.query.search)
      );
      console.log(
        "\n \n \n  #############FILTRADOS #########" + filteredJuegos
      );
      console.log("\n \n \n  ");
      if (filteredJuegos.length === 0) {
        res.render("publico_index", {
          mensaje: "No se encontraron juegos",
          busqueda: req.query.search,
        });
      } else {
        res.render("publico_index", {
          juegos: filteredJuegos,
          busqueda: req.query.search,
        });
      }
    })
    .catch((err) => {
      res.render("publico_error");
    });
});

router.get("/juego/:id", (req, res) => {
  console.log("Buscando juego " + req.params.id);
  Juego.findById(req.params.id)
    .then((juego) => {
      console.log("Cargando vista " + juego.nombre);
      if (!juego) {
        res.render("publico_error", { message: "Juego no encontrado" });
      } else {
        res.render("publico_juego", { juego });
      }
    })
    .catch((err) => {
      res.render("publico_error");
    });
});

module.exports = router;
