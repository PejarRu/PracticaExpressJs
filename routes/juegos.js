/**
 * Fichero routes/juegos.js: Archivo con las
 * peticiones al servidor de
 *   (GET)/juegos,
 *   (GET)/juegos/nuevo,
 *   (POST)/juegos/nuevo
 *   (GET)/juegos/editar/:id,
 *   (PUT)/juegos/editar/:id,
 *   (DELETE)/juegos/:id
 */

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
let Juego = require(__dirname + "/../models/juego.js");
const authMiddleware = require("../utils/middleware");

//Preparacion de MULTER
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
// (GET) /admin/juegos
router.get("/juegos", authMiddleware, (req, res) => {
  Juego.find()
    .then((juegos) => {
      console.log(juegos);

      res.render("admin_juegos", { juegos });
    })
    .catch((error) => {
      res.render("admin_error");
    });
});

// (GET) /admin/juegos/nuevo
router.get("/juegos/nuevo", authMiddleware, (req, res) => {
  res.render("admin_juegos_form");
});
// (POST) /admin/juegos/nuevo
router.post("/juegos/nuevo", upload.single("imagen"), (req, res) => {
  // Si se recibe una imagen, se utiliza multer para copiarla en la carpeta public/uploads
  if (req.file) {
    const fecha = new Date();
    const nombreArchivo = `${fecha.getTime()}_${req.file.originalname}`;

    try {
      fs.renameSync(
        req.file.path,
        path.join(__dirname, "public/uploads/", nombreArchivo)
      );
      juego.imagen = nombreArchivo;
    } catch (error) {
      console.error(error);
      res.render("admin_error", { error: "No se ha podido subir imagen" });
      return;
    }
  }

  const juego = new Juego({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    edad: req.body.edad,
    jugadores: req.body.jugadores,
    tipo: req.body.tipo,
    precio: req.body.precio,
    ediciones: [
      {
        edicion: req.body.edicion,
        anio: req.body.anyo,
      },
    ],
    imagen: req.file ? req.file.filename : "",
  });
  juego
    .save()
    .then(() => {
      res.redirect("/admin/juegos");
    })
    .catch((error) => {
      console.error(error);
      res.render("admin_error", { error });
    });
});

// (GET) /admin/juegos/editar/:id
router.get("/juegos/editar/:id", authMiddleware, (req, res) => {
  Juego.findById(req.params.id)
    .then((juego) => {
      if (juego) {
        res.render("admin_juegos_form", {
          juego: juego,
        });
      } else {
        res.render("admin_error", { message: "Juego no encontrado" });
      }
    })
    .catch((error) => {
      res.render("admin_error");
    });
});

// (PUT) /admin/juegos/:id
//!He probado con el methodo "router.put", pero no me funciona.
//!He hecho require del metodo, lo he vinculado al router, etc...No me funciona :(
router.post(
  "/juegos/:id",
  authMiddleware,
  upload.single("imagen"),
  (req, res) => {
    console.log("update 1");
    Juego.findByIdAndUpdate(req.params.id)
      .then((juego) => {
        if (!juego) {
          res.render("admin_error", { message: "Juego no encontrado" });
          return;
        }
        // Si se recibe una nueva imagen, se utiliza multer para copiarla en la carpeta public/uploads
        if (req.file) {
          const fecha = new Date();
          const nombreArchivo = `${fecha.getTime()}_${req.file.originalname}`;
          fs.renameSync(
            req.file.path,
            path.join(__dirname, "public/uploads/", nombreArchivo)
          );
          juego.imagen = nombreArchivo;
        }

        (juego.nombre = req.body.nombre),
          (juego.descripcion = req.body.descripcion),
          (juego.edad = req.body.edad),
          (juego.jugadores = req.body.jugadores),
          (juego.tipo = req.body.tipo),
          (juego.precio = req.body.precio),
          (juego.edicion = req.body.edicion),
          juego
            .save()
            .then(() => {
              res.redirect("/admin/juegos");
            })
            .catch((error) => {
              res.render("admin_error", {
                message: "Error al modificar el juego",
              });
            });
      })
      .catch((error) => {
        res.render("admin_error");
      });
  }
);

//(DELETE) /admin/juegos/:id
//! Lo mismo que con el put, no funciona el methodo delete;
/*
router.delete("/:id", authMiddleware, (req, res) => {
  Juego.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/admin/juegos");
    })
    .catch((error) => {
      res.render("admin_error", { error: "Error borrando contacto" });
    });
});
*/
router.post("/juegos/borrar/:id", authMiddleware, (req, res) => {
  Juego.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/admin/juegos");
    })
    .catch((error) => {
      res.render("admin_error", { error: "Error borrando contacto" });
    });
});

module.exports = router;
