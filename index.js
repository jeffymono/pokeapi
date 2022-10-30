// Variables Iniciales
const express = require("express");
var cors = require("cors");
const app = express();
const db = require("./queries");
const config = require("./settings");
const port = process.env.PORT || config.PORT;

// Habilito los CORS
app.use(cors());
// Ruta inicial de la api
app.get("/", (request, response) => {
  response.json({
    info: "Api de pokemones funcionando correctamente!",
  });
});
// Mis rutas de las apis
app.get("/api/v2/pokemon", db.getPokemones);
app.get("/api/v2/pokemon/:parametro", db.getPokemonById);

// Levanto mi app eb el puerto
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
