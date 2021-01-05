//Express.js and body-parser
const express = require("express");
const bodyParser = require("body-parser");
const flash = require("express-flash");

//Middleware for serving the /public folder as a static folder
const staticFileMiddleware = express.static(__dirname + "/public");

/**************
 SETUP EXPRESS app
**************/
var app = express();
app.use(flash());

//Set up swagger for documenting our API.
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use(
  "/swagger",
  function (req, res, next) {
    swaggerDocument.host = req.get("host");
    req.swaggerDoc = swaggerDocument;
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup()
);

// Server Configurations
app.use(bodyParser.urlencoded({ extended: true }));
app.use(staticFileMiddleware);

//Set up our router:
const router = new express.Router();
router.use("/api", require("./routes/api"));
router.use("/", require("./routes/"));

app.use(router);

/**************
 Setup server
**************/
const server = require("http").Server(app);

module.exports = server;
