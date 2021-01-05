const Router = require("express").Router;
const router = new Router();
const Classes = require("../../classes");

// Create new Order
router.post("/order", async (req, res, next) => {
  try {
    let order = new Classes.Order(req.body); // Create order

    res.status(200).json({
      status: "received",
      message: "Order successfully received.",
      order,
      OrderQueue,
    });
  } catch (err) {
    //Catch if the job object is missing or malformed and let the client know.
    res.status(405).json({ status: "Bad order", message: err });
  }
});

// Create new Order
router.post("/courier", async (req, res, next) => {
  try {
    let courier = new Classes.Courier(req.body); // Create courier instance

    res.status(200).json({
      status: "received",
      message: "Courier successfully spawned.",
      courier,
    });
  } catch (err) {
    //Catch if the job object is missing or malformed and let the client know.
    res.status(405).json({ status: "Bad courier format", message: err });
  }
});

module.exports = router;
