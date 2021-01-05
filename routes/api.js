const Router = require("express").Router;
const router = new Router();

router.get("/ping", (req, res, next) => {
  res.send("pong");
});

router.use("/v1", require("./v1"));

module.exports = router;
