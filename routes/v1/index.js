const Router = require("express").Router;
const router = new Router();
const Classes = require("../../classes");

/***
 * A relevant todo would be to seperate the tight coupling between orders and courier generation (essentially allowing for the creation of order-less couriers and vice versa)
 * but for our current challenge, we assume the tight 1:1 ration between couriers and orders
 * */

// Create new Order
router.post("/order", async (req, res, next) => {
  try {
    //We could call the /courier API endpoint here, too, but this is simpler given our tight coupling.
    let order = new Classes.Order(req.body); // Create order

    //spawn a new courier; if our order comes with a request for a designated courier, we assign him the orderId of this order.
    let courier = new Classes.Courier(
      req.body.designatedCourier === "true" ? req.body.id : "any"
    );

    res.status(200).json({
      status: "received",
      message: "Order successfully received.",
      order,
    });
  } catch (err) {
    console.log(err);
    //Catch if the job object is missing or malformed and let the client know.
    res.status(405).json({ status: "Bad order", message: err });
  }
});

// Courier endpoint
//TODO: decouple the use case of this from the order endpoint;
//as it is now, we could potentially use localhost/swagger to generate a number of orderless couriers to gauge impact.
router.post("/courier", async (req, res, next) => {
  try {
    let courier = new Classes.Courier(req.body.orderId || "any"); // Create courier instance.

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
