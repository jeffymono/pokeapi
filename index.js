// Variables Iniciales
const express = require("express");
var cors = require("cors");
const db = require("./queries");
const config = require("./settings");
const app = express();
const port = process.env.PORT || config.PORT;
const { swaggerDocs: V1SwaggerDocs } = require("./swagger");
// Habilito los CORS
app.use(cors());
// Ruta inicial de la api
app.get("/", (request, response) => {
  response.json({
    info: "Api de pokemones funcionando correctamente!",
  });
});

// Documentacion Swagger
// Metodo GET Todos los pokemones
/**
 * @openapi
 * /api/v2/pokemon:
 *   get:
 *     tags:
 *       - Pokemones
 *     parameters:
 *       - in: query
 *         schema:
 *           type: string
 *         description: Listado de pokemones
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   results:
 *                     $ref: "#/"
 *       5XX:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Some error message"
 */
// Metodo GET Pokemon específico
/**
 * @openapi
 * /api/v2/pokemon/{parametro}:
 *   get:
 *     tags:
 *       - Trae solo un Pokemon
 *     parameters:
 *       - in: path
 *         name: parametro
 *         schema:
 *           type: string
 *         description: Puede ingresar el id o nombre del pokemon como parámetro
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   Informacion:
 *                     $ref: "#/"
 *       5XX:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Some error message"
 */

// Metodo GET para buscar coincidencias de pokemones
/**
 * @openapi
 * /api/v2/pokemon/buscar/{parametro}:
 *   get:
 *     tags:
 *       - Buscar pokemones
 *     parameters:
 *       - in: path
 *         name: parametro
 *         schema:
 *           type: string
 *         description: Puede ingresar el id o nombre del pokemon como parámetro para buscar coincidencias de pokemones
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   results:
 *                     $ref: "#/"
 *       5XX:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Some error message"
 */

// Mis rutas de las apis
app.get("/api/v2/pokemon", db.getPokemones);
app.get("/api/v2/pokemon/:parametro", db.getPokemonById);
app.get("/api/v2/pokemon/buscar/:parametro", db.getPokemonesBusqueda);

// Levanto mi app eb el puerto
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
  V1SwaggerDocs(app, port);
});
