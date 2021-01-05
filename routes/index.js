const Router = require("express").Router;
const router = new Router();

router.get("/", (req, res, next) => {
  res.send("Hello World");
});

module.exports = router;
