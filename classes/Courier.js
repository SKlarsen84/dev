//imports
const utility = require("../utility");
const { v4: uuidv4 } = require("uuid");

/**
 * Represents a Courier
 * @constructor
 * @param {string} name - The name of the courier - if not specified a random name will be generated, but should be drawn from an array of available couriers.
 * @param {string} orderId - If specified, designated the Courier to only pick up a specific order. Defaults to 'any'
 * @param {string} travelTime - The travel time from the courier to the pickup location; if not designated, a random interval between 3-15 seconds will be generated:
 */

class Courier {
  constructor(obj) {
    this.courier = {
      uuid: uuidv4(),
      name: obj.name || utility.getRandomName(),
      orderId: obj.orderId || 'any',
      travelTime: obj.travelTime || (Math.floor(Math.random() * 12) + 3) * 1000,
    };

    //Immediately once a courier is spawned, they will be added to the queue of travelling couriers
    this.markAsTravelling(this.courier);

    //Once a courier has traveled for their allotted time, they wil mark themselves as ready.
    setTimeout(this.markAsReady, this.courier.travelTime, this.courier);
  }

  //Have the courier add itself to the global queue of TravellingCouriers
  markAsTravelling(courier) {
    TravellingCourierQueue.push(courier);
  }

  //Lets the courier remove itself from TravellingCouriers and add itself to ReadyCouriers
  markAsReady(courier) {
    //Look among travelling couriers to find the one that is us - i.e. that matches our uuid
    try {
      TravellingCourierQueue.splice(
        TravellingCourierQueue.findIndex(function (i) {
          return i.uuid === courier.uuid;
        }),
        1
      );
    } catch (ex) {
      console.log(ex);
    }

    //We have finished travelling - and join the queue for ready couriers
    ReadyCourierQueue.push(courier);
  }
}

module.exports = Courier;
