/**
 * Fichero routes/juegos.js: Archivo con las
 * peticiones al servidor de
 *   (GET)admin/juegos,
 *   (GET)admin/juegos/nuevo,
 *   (POST)admin/juegos/nuevo
 *   (GET)admin/juegos/editar/:id,
 *   (PUT)admin/juegos/editar/:id,
 *   (DELETE)admin/juegos/:id
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
//configuracion de multer

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('imagen');
//funcion para manipular imagenes
function checkFileType(file,
  cb) {
  //extensiones permitidas
  const filetypes = /jpeg|jpg|png|gif/;
  //comprobamos extension
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  //comprobamos el tipo de archivo
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {

    cb('Error: Solo imagenes!');
  }
}

// (GET) /admin/juegos
router.get("/", authMiddleware, (req, res) => {
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
router.get("/nuevo", authMiddleware, (req, res) => {
  res.render("admin_juegos_form");
});

// (POST) /admin/juegos/nuevo
router.post("/nuevo", authMiddleware, upload, (req, res) => {
  console.log('Creando nuevo juego');

  const nuevoJuego = new Juego({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    edad: req.body.edad,
    jugadores: req.body.jugadores,
    tipo: req.body.tipo,
    precio: req.body.precio,
    ediciones: [],
  });
  // Si hay algún elemento en el array ediciones, validar la propiedad "edicion"
  if (req.body.edicion && req.body.edicion.length > 0) {
    console.log('El nuevo juego tiene ediciones. Procesando...');
    console.log('[' + req.body.edicion.length + ']: ' + req.body.edicion);
    for (let i = 0; i < req.body.edicion.length; i++) {
      // Comprobamos si el elemento del array tiene la propiedad "edicion"
      if (req.body.edicion[i] && req.body.anyoEdicion[i]) {
        nuevoJuego.ediciones.push({
          edicion: req.body.edicion[i],
          anyo: req.body.anyoEdicion[i]
        })
      }
    }
  }
  // Si se recibe una imagen, se utiliza multer para copiarla en la carpeta public/uploads
  if (req.file) {
    const fecha = new Date();
    const nombreArchivo = `${fecha.getTime()}-${req.file.originalname}`;
    try {
      fs.renameSync(
        req.file.path,
        path.join(__dirname, "../public/uploads/", nombreArchivo)
      );
      nuevoJuego.imagen = nombreArchivo;
    } catch (error) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error(err);
      });
      console.error(error);
      res.render("admin_error", { error: "No se ha podido subir imagen" });
      return;
    }
  }

  nuevoJuego.save()
    .then(juego => {
      res.redirect('/admin/juegos');
    })
    .catch((error) => {
      console.error(error);
      res.render("admin_error", { error });
    });
});

// (GET) /admin/juegos/editar/:id
router.get("/editar/:id", authMiddleware, (req, res) => {
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
router.put("/:id", authMiddleware, upload, (req, res) => {
  console.log('Editando juego con id', req.params.id);
  console.log(req.body);

  const juegoEditado = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    edad: req.body.edad,
    jugadores: req.body.jugadores,
    tipo: req.body.tipo,
    precio: req.body.precio,
    ediciones: [],
  };
  // Si hay algún elemento en el array ediciones, validar la propiedad "edicion"
  if (req.body.edicion && req.body.edicion.length > 0) {
    console.log('El juego editado tiene ediciones. Procesando...');
    console.log('[' + req.body.edicion.length + ']: ' + req.body.edicion);
    for (let i = 0; i < req.body.edicion.length; i++) {
      // Comprobamos si el elemento del array tiene la propiedad "edicion"
      if (req.body.edicion[i] && req.body.anyoEdicion[i]) {
        juegoEditado.ediciones.push({
          edicion: req.body.edicion[i],
          anyo: req.body.anyoEdicion[i]
        })
      }
    }
  }
  // Si se recibe una imagen, se utiliza multer para copiarla en la carpeta public/uploads
  if (req.file) {
    console.log('Hay una imagen en el form');
    const fecha = new Date();
    const nombreArchivo = `${fecha.getTime()}-${req.file.originalname}`;
    try {
      // Comprobamos si el juego ya tiene una imagen
      Juego.findById(req.params.id).then(juego => {
        if (juego.imagen) {
          // Si tiene una imagen, la renombramos y reemplazamos por la nueva
          console.log('El jugo ya tiene una imagen');

          fs.renameSync(
            req.file.path,
            path.join(__dirname, "../public/uploads/", nombreArchivo)
          );
          // Borramos la imagen antigua
          fs.unlinkSync(path.join(__dirname, "../public/uploads/", juego.imagen));
        } else {
          // Si no tiene una imagen, guardamos la nueva
          console.log('El juego aun no tiene imagen');

          fs.renameSync(
            req.file.path,
            path.join(__dirname, "../public/uploads/", nombreArchivo)
          );
        }
        console.log('Nombre del nuevo archivo: ' + juegoEditado.imagen);
        juegoEditado.imagen = nombreArchivo;
        console.log('Nueva imagen del juego: ' + juegoEditado.imagen);
        // Actualizamos los datos del juego
        Juego.findByIdAndUpdate(req.params.id, juegoEditado, { new: true })
          .then(juego => {
            res.redirect('/admin/juegos');
          })
          .catch((error) => {
            console.error(error);
            res.render("admin_error", { error });
          });
      });
    } catch (error) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error(err);
      });
      console.error(error);
      res.render("admin_error", { error: "No se ha podido subir imagen" });
      return;
    }
  } else {
    console.log('No hay ninguna imagen en el form');
    // Si no se recibe una imagen, actualizamos los datos sin cambiar la imagen
    Juego.findByIdAndUpdate(req.params.id, juegoEditado, { new: true })
      .then(juego => {
        res.redirect('/admin/juegos');
      })
      .catch((error) => {
        console.error(error);
        res.render("admin_error", { error });
      });
  }
});

//(DELETE) /admin/juegos/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  console.log('Eliminando juego !');
  try {
    const juego = await Juego.findByIdAndRemove(req.params.id).then(() => {
      console.log('Eliminado');
      res.redirect("/admin/juegos");
    })

  } catch (error) {
    res.render("admin_error", { error: "Error borrando juego" });
  }
});

/*
router.post("/borrar/:id", authMiddleware, (req, res) => {
  Juego.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/admin/juegos");
    })
    .catch((error) => {
      res.render("admin_error", { error: "Error borrando juego" });
    });
});
*/
/*
//Añadimos una nueva edicion a un juego existente
router.post('/ediciones/:idJuego', (req, res) => {
  Juegos.findById(req.params['idJuego'])
    .then(juego => {
      juego.Ediciones.push({ edicion: req.body.edicion, anyo: req.body.anyo })
      juego.save()
      res.status(200)
        .send({ ok: true, resultado: juego.Ediciones });
    }).catch(error => {
      res.status(400)
        .send({ ok: false, error: "Error modificadno las ediciones del juego" });
    })
});
//Eliminamos una edicion de un juego alamacenado
router.delete('/ediciones/:idJuego/:idEdicion', (req, res) => {
  Juegos.findByIdAndUpdate(req.params.idJuego)
    .then(resultado => {
      resultado.Ediciones.pull(req.params.idEdicion)
      resultado.save()
      //juego.Ediciones.id(req.params.idEdicion).remove()
      res.status(200)
        .send({ ok: true, resultado: resultado });
    }).catch(error => {
      res.status(400)
        .send({ ok: false, error: "Error eliminando la edicion del juego" });
    })
});
//Añadimos una nueva edicion a un juego existente
router.post('/ediciones/:idJuego', (req, res) => {
  Juegos.findById(req.params['idJuego'])
    .then(juego => {
      juego.Ediciones.push({ edicion: req.body.edicion, anyo: req.body.anyo })
      juego.save()
      res.status(200)
        .send({ ok: true, resultado: juego.Ediciones });
    }).catch(error => {
      res.status(400)
        .send({ ok: false, error: "Error modificadno las ediciones del juego" });
    })
});
*/

module.exports = router;
