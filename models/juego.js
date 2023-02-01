const mongoose = require("mongoose");

//Esquema Edicion
let schemaEdicion = new mongoose.Schema({
  edicion: {
    type: String,
    required: true,
  },
  anyo: {
    type: Number,
    required: false,
    min: 2000,
    max: new Date().getFullYear(),
  },
});

const schemaJuego = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    minlength: 6,
  },
  descripcion: {
    type: String,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  jugadores: {
    type: Number,
    required: true,
  },
  tipo: {
    type: String,
    enum: ["rol", "escape", "dados", "fichas", "cartas", "tablero"],
    required: true,
  },
  precio: {
    type: Number,
    required: true,
    min: 0,
  },
  imagen: {
    type: String,
    required: false,
  },
  ediciones: [schemaEdicion],
});

const Juego = mongoose.model("juego", schemaJuego);

module.exports = Juego;
