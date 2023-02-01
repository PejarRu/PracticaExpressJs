/**
 * Fichero generar_juegos.js: Archivo de 
 * utilidad que genera 4 jeugos de mesa basicos para 
 * comprobar la funcionalidad de la app
 */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Juego = require(__dirname + "/../models/juego");
Juego.collection.drop();
const juego1 = new Juego({
  nombre: "Ajedres potter",
  descripcion: "Juego de rol con dados y fichas",
  edad: 12,
  jugadores: 2,
  tipo: "rol",
  precio: 20,
  imagen: "ajedrez-HPoter.jpg",
  ediciones: [
    {
      edicion: "HarryPoter",
      anyo: 2020,
    },
  ],
}).save();

const juego2 = new Juego({
  nombre: "Parchis",
  descripcion: "Parchis clasico - Navidad",
  edad: 3,
  jugadores: 4,
  tipo: "fichas",
  precio: 30,
  imagen: "parchis.jpeg",
  ediciones: [
    {
      edicion: "Tematica navideña",
      anyo: 2021,
    },
  ],
}).save();

const juego3 = new Juego({
  nombre: "Monopolio - HP",
  descripcion: "Juego de estrategia y negociación con harry poter",
  edad: 8,
  jugadores: 6,
  tipo: "dados",
  precio: 15,
  imagen: "monopoly-HPoter.jpg",
  ediciones: [
    {
      edicion: "Hp",
      anyo: 2019,
    },
  ],
}).save();

const juego4 = new Juego({
  nombre: "Monopolio Fortnite",
  descripcion: "Juego de estrategia y negociación",
  edad: 6,
  jugadores: 4,
  tipo: "dados",
  precio: 25,
  imagen: "monopoly-Fortnite.jpg",

  ediciones: [
    {
      edicion: "Fortnite",
      anyo: 2019,
    },
  ],
}).save();

Juego.find().then((result) => {
  console.log(result);
});