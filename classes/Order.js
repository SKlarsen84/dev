/**
 * Represents an Order - is constructed from a js object.
 * @constructor
 * @example   {"id": "58e9b5fe-3fde-4a27-8e98-682e58a4a65d","name": "McFlury","prepTime": 14}
 */

class Order {
  constructor(obj) {
    //if our object is not a proper order object, containing our needed information, throw it out immediately.
    if (!obj.id || !obj.name || !obj.prepTime) {
      throw "Invalid order object";
    }

    //If we pass this rudimentary check, we are feel confident in adding our order to the queue.
    this.addToOrders(obj);
  }

  //HAve the order add itself to the order queue
  addToOrders(order) {
    OrderQueue.push(order);
  }
}

module.exports = Order;
