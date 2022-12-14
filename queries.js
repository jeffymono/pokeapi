const Pool = require("pg").Pool;
const config = require("./settings");
const port =
  process.env.PORT != null || process.env.PORT != undefined ? "" : config.PORT;
const pool = new Pool({
  user: "uuuvtuaepgnzxw",
  host: "ec2-54-163-34-107.compute-1.amazonaws.com",
  database: "dfs3prc4ho99qo",
  password: "07d6e34e713f4cfd5dd1961f5dcc914d560d46535e399f51877022584b724146",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

const getPokemones = (request, response) => {
  pool.query(
    `SELECT "PokemonID","Nombre" FROM public."Pokemon" ORDER BY "PokemonID"`,
    (error, results) => {
      if (error) {
        throw error;
      }
      const protocol = request.protocol;
      const host = request.hostname;
      const url = request.originalUrl;
      const fullUrl = `${protocol}://${host}${
        port != "" ? ":" + port : port
      }${url}`;

      const data = results.rows.map((elemento) => {
        elemento.url = fullUrl + "/" + elemento.PokemonID;
        delete elemento.PokemonID;
        return { ...elemento };
      });
      response.status(200).json({ results: data });
    }
  );
};

const getPokemonesBusqueda = (request, response) => {
  // Obtengo el parametro si es id o nombre del pokemon
  const parametro = parseInt(request.params.parametro)
    ? parseInt(request.params.parametro)
    : request.params.parametro;
  pool.query(
    `SELECT "PokemonID","Nombre"
            FROM public."Pokemon" pok
            WHERE ` +
      (typeof parametro == "number"
        ? `pok."PokemonID"= ${parametro}`
        : `LOWER(pok."Nombre") like '%${parametro.toLowerCase()}%'`),
    (error, results) => {
      if (error) {
        throw error;
      }
      const protocol = request.protocol;
      const host = request.hostname;
      const url = request.originalUrl;
      const fullUrl = `${protocol}://${host}${
        port != "" ? ":" + port : port
      }/api/v2/pokemon`;

      const data = results.rows.map((elemento) => {
        elemento.url = fullUrl + "/" + elemento.PokemonID;
        delete elemento.PokemonID;
        return { ...elemento };
      });
      response.status(200).json({ results: data });
    }
  );
};

const getPokemonById = (request, response) => {
  // Obtengo el parametro si es id o nombre del pokemon
  const parametro = parseInt(request.params.parametro)
    ? parseInt(request.params.parametro)
    : request.params.parametro;

  // Query de la base de datos
  pool.query(
    `SELECT pok."PokemonID", pok."Nombre", pok."Descripcion", pok."Peso", pok."Altura", pok."Imagen", evo."Nombre" Evolucion, evo."Imagen" ImagenEvolucion, tipo."Nombre" Tipo
            FROM public."Pokemon" pok
            INNER JOIN public."Evolucion" evo on pok."PokemonID" = evo."ProkemonID"
            INNER JOIN public."PokemonTipo" pt on pok."PokemonID" = pt."PokemonID"
            INNER JOIN public."Tipo" tipo on pt."TipoID" = tipo."TipoID"
            WHERE ` +
      (typeof parametro == "number"
        ? `pok."PokemonID"= ${parametro}`
        : `LOWER(pok."Nombre") = '${parametro.toLowerCase()}'`),
    (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows.length < 1) return response.status(404).end();
      // Saco el primer elemento que es mi pokemon elegido
      const pokemonEncontrado = results.rows[0];
      // Elimino duplicados
      const evoluciones = results.rows.filter(
        (valorActual, indiceActual, arreglo) => {
          //Podr??amos omitir el return y hacerlo en una l??nea, pero se ver??a menos legible
          return (
            arreglo.findIndex(
              (valorDelArreglo) =>
                valorDelArreglo.evolucion === valorActual.evolucion
            ) === indiceActual
          );
        }
      );
      // Elimino duplicados
      const tipos = results.rows.filter(
        (valorActual, indiceActual, arreglo) => {
          //Podr??amos omitir el return y hacerlo en una l??nea, pero se ver??a menos legible
          return (
            arreglo.findIndex(
              (valorDelArreglo) => valorDelArreglo.tipo === valorActual.tipo
            ) === indiceActual
          );
        }
      );
      // Asigno la lista de evoluciones a mi poke
      pokemonEncontrado.evoluciones = evoluciones.map(
        ({ evolucion, imagenevolucion }) => ({
          evolucion,
          imagenevolucion,
        })
      );
      // Asigno la lista de tipos a mi poke
      pokemonEncontrado.tipos = tipos.map(({ tipo }) => ({
        tipo,
      }));
      // Asigno mi imagen del pokemon
      pokemonEncontrado.sprites = {
        other: { home: { front_default: pokemonEncontrado.Imagen } },
      };
      // Elimino las propiedades del objeto que ahora tengo como propiedades array
      delete pokemonEncontrado.evolucion;
      delete pokemonEncontrado.tipo;
      delete pokemonEncontrado.imagenevolucion;
      delete pokemonEncontrado.Imagen;

      // Respuesta con el json
      response.status(200).json({ Informacion: pokemonEncontrado });
    }
  );
};
// Exporto mis 2 funciones de datos
module.exports = {
  getPokemones,
  getPokemonById,
  getPokemonesBusqueda,
};
