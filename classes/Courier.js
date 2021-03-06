//imports
const utility = require("../utility");
const { v4: uuidv4 } = require("uuid");

/**
 * Represents a Courier
 * @constructor
 * @param {string} orderId - If specified, designated the Courier to only pick up a specific order. Defaults to 'any'
 * @example  {"orderId": "58e9b5fe-3fde-4a27-8e98-682e58a4a65d"}
 * @example  {"orderId": "any"}
 */

class Courier {
  constructor(orderId = "any") {
    (this.uuid = uuidv4()),
      (this.name = utility.getRandomName()),
      (this.orderId = orderId),
      (this.travelTime = Math.floor(Math.random() * 12) + 3),
      (this.creationTime = Date.now()),
      (this.readyTime = null),
      (this.finishTime = null);
    //Immediately once a courier is spawned, they will be added to the queue of travelling couriers
    TravellingCourierQueue.push(this);
    console.log(
      `new courier on the way: ${this.name} for order: "${
        this.orderId
      }" - arrives in in ${this.travelTime * 1000}`
    );

    /***
     * Once a courier has traveled for their allotted time, they will mark themselves as ready;
     * the courier instance itself (this), is passed as a param
     */
    setTimeout(this.markCourierAsReady, this.travelTime * 1000, this);
  }

  //Lets the courier instance remove itself from TravellingCouriers and move itself to ReadyCouriers
  markCourierAsReady(courier) {
    //Find the courier instance in our queue of travelling couriers that is identical to us
    let index = TravellingCourierQueue.findIndex((item) => {
      return item === this;
    });

    //Once our courier has been marked ready,we can update its timestamps for our analytics
    courier.readyTime = Date.now();

    //We found our position in the travelling queue; splice our courier and then push it to the ready queue.
    if (index) {
      TravellingCourierQueue.splice(index, 1);
      ReadyCourierQueue.push(courier);

      //Once we have our courier waiting around in the queue of Ready Couriers, they can perform their first check for vacant orders
      courier.findAvailableOrder(courier);
    }
  }

  /**
   * /method to let us remove the courier entirely from all queues.
   * @method
   * @param {object} courier - specficies which courier should be activated (will always be itself)
   */
  removeFromKitchen(courier) {
    //check for ready queue index
    let rIndex = ReadyCourierQueue.findIndex((item) => {
      return item.uuid === courier.uuid;
    });

    //We found our position in the ready queue; splice our courier out
    if (rIndex > -1) {
      ReadyCourierQueue.splice(rIndex, 1);
      console.log(`${courier.name} has left the kitchen`);
    }

    //Finally, have the courier emit a signal to all listening clients that contains all of itself, including a final timestamp for finishTime
    courier.finishTime = Date.now();

    //emit a courier finish event for our clients
    io.emit("courier_finish", {
      courier,
    });
  }

  /**
   * /method to let a courier try to find and handle orders in the OrdersForPickup queue.
   * @method
   * @param {object} courier - specficies which courier should be activated (will always be itself)
   */
  async findAvailableOrder(courier) {
    console.log(courier.name + " is waiting for available order...");

    if (OrdersForPickup.length > 0) {
      try {
        //if our courier does not come with a specified order, it'll activate the oldest order off the order queue if there is one.
        if (courier.orderId === "any") {
          pickUpOldestOrder(courier);

          //Once the worker has taken its order, they're out of the kitchen/queue
          this.removeFromKitchen(courier);
        } else if (courier.orderid != "any") {
          console.log(
            "courier wants to pick up specific order: " + courier.orderId
          );
          let pickup = pickUpSpecificOrder(courier);
          if (pickup === true) {
            this.removeFromKitchen(courier);
          }
        }
      } catch (ex) {
        console.log(ex);
      }
    }
  }
}

module.exports = Courier;

/// Order-selection strategies

//pick up the first order in the queue and handle it in accordance with FIFO-principle
function pickUpOldestOrder(courier) {
  let workOrder = OrdersForPickup[0];

  //Have the order emit its finish event to clients
  workOrder.sendFinishEvent();

  //remove the order from the OrdersForPickup queue.
  OrdersForPickup.splice(0, 1);
  console.log(
    `${courier.name} picked up order: ${workOrder.id} (${workOrder.name})`
  );

  /***
   * Defensive move to guard against a scenario where we - in the future - may want to run mixed types of couriers (designated/any)
   * In this case, an "agnostic" courier with "any" orderid may arrive first and finish an order that has designated courier still travelling
   * This would, over time, cause congestion in the worker queue, as the designated couriers would never be released.
   */

  let index = ReadyCourierQueue.findIndex((courier) => {
    return courier.orderId === workOrder.id;
  });

  //We found a courier who is designated for this particular order; REmove it from the kitchen since they will never get work.
  if (index > -1) {
    console.log(
      ReadyCourierQueue[index].name +
        "'s order has already been picked up by someone else!"
    );
    this.removeFromKitchen(ReadyCourierQueue[index]);
  }
}

//pick up the first order in the queue and handle it in accordance with FIFO-principle
function pickUpSpecificOrder(courier) {
  let index = OrdersForPickup.findIndex((item) => {
    return item.id == courier.orderId;
  });

  //We found our position in the travelling queue; splice our courier and then push it to the ready queue.
  if (index > -1) {
    OrdersForPickup[index].sendFinishEvent();
    OrdersForPickup.splice(index, 1);
    console.log(
      `${courier.name} picked up his designated order: ${courier.orderId} `
    );
    return true;
  } else {
    console.log(courier.name + " did not find his designated order");
    return false;
  }
}
