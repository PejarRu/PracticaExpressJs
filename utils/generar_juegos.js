/**
 * Fichero generar_juegos.js: Archivo de 
 * utilidad que genera 4 jeugos de mesa basicos para 
 * comprobar la funcionalidad de la app
 */
const Juego = require(__dirname + "/../models/juego");

const juegos = [
  {
    nombre: "Ajedres",
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
      {
        edicion: "Pokemon",
        anyo: 2013,
      },
    ],
  },
  {
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
  },
  {
    nombre: "Monopolio - HP",
    descripcion: "Juego de estrategia y negociación con harry poter",
    edad: 8,
    jugadores: 6,
    tipo: "dados",
    precio: 15,
    imagen: "",
    ediciones: [
      {
        edicion: "Hp",
        anyo: 2019,
      },
    ],
  },
  {
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
  },
];

exports.reiniciarJuegos = async function () {
  try {
    await Juego.collection.drop();
    console.log('Colección de juegos borrada');
  } catch (error) {
    console.error('########========########');
    console.error('Error al borrar la colección de juegos');
    console.error(error);
    console.error('########========########');
  }

  for (let index = 0; index < juegos.length; index++) {
    try {
      await new Juego(juegos[index]).save();
      console.log(`Juego ${index} guardado`);

    } catch (error) {
      console.error('########========########');
      console.error('Error al guardar juego');
      console.error(error);
      console.error('########========########');
    }
  }

  try {
    const result = await Juego.find();
    console.log(result);
  } catch (error) {
    console.error('########========########');
    console.error('Error al buscar juegos');
    console.error(error);
    console.error('########========########');
  }
};
