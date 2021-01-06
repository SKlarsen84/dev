/**
 * Represents an Order - is constructed from a js object.
 * @constructor
 * @example   {"id": "58e9b5fe-3fde-4a27-8e98-682e58a4a65d","name": "McFlury","prepTime": 14}
 */

class Order {
  constructor(obj) {
    console.log(obj)
    //if our object is not a proper order object, containing our needed information, throw it out immediately.
    if (!obj.id || !obj.name || !obj.prepTime) {
      throw "Invalid order object";
    }

    (this.id = obj.id), (this.name = obj.name), (this.prepTime = obj.prepTime);

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
}

module.exports = Order;
