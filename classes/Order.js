const { v4: uuidv4 } = require("uuid");


/**
 * Represents an Order - is constructed from a js object.
 * @constructor
 * @param {string} id -  provides a uuid of the meal (will generate one if none is provided)
 * @param {string} name - the name of the order / meal
 * @param {integer} prepTime - Designates the prepTime of the meal in seconds
 * @example   {"id": "58e9b5fe-3fde-4a27-8e98-682e58a4a65d","name": "McFlury","prepTime": 14}
 */

class Order {
  constructor(obj) {
  
    if (!obj.name || !obj.prepTime) {
      throw "Invalid order object"; //we're missing some valuable data here, that we cannot generate ourselves.
    }

    (this.id = obj.id ||uuidv4()), //while our orders.json data comes wihth pregenerated uuids, we retain the ability to generate one if its missing.
      (this.name = obj.name),
      (this.prepTime = obj.prepTime),
      (this.creationTime = Date.now()),
      (this.readyTime = null),
      (this.finishTime = null);

    //Immediately once a order is accepted, we add it to the order queue
    OrderQueue.push(this);
    console.log(
      `new order: ${this.id} for ${obj.name}- ready in ${obj.prepTime * 1000}`
    );

    //After this, the cooks start working and the prepTime counter begins; once its preptime is reached, the order is marked as ready.
    setTimeout(this.markOrderAsReady, this.prepTime * 1000, this);
  }

  //we use markAsReady to add it to the list of ready orders.

  markOrderAsReady(order) {
    //Find this order instance in  the orderqueue.
    let index = OrderQueue.findIndex((order) => {
      return order.id == this.id;
    });

    //Once our order has been marked ready,we can update its timestamps for our analytics
    order.readyTime = Date.now();

    //We found our order in the OrderQueue; splice our order out of the orderqueue and then push it to the list of Orders for Pickup
    if (index) {
      OrderQueue.splice(index, 1);
      OrdersForPickup.push(order);

      //Notifiy each of our couriers that there's an order, and have them take it via either FIFO/matched strategy, depending .
      ReadyCourierQueue.forEach((courier) => {
        try {
          courier.findAvailableOrder(courier);
        } catch (ex) {
          throw ex;
        }
      });
    }
  }

  sendFinishEvent() {
    this.finishTime = Date.now();

    let order = this;
    //emit a courier finish event for our clients
    io.emit("order_finish", {
      order,
    });
  }
}

module.exports = Order;
