const COURIERNAMES = require("../data/" + process.env.COURIERNAMES).names;

/**
 * Retrieves a random name for a courier
 * @function
 */
function getRandomName() {
  return COURIERNAMES[Math.floor(Math.random() * COURIERNAMES.length)];
}
module.exports = getRandomName;
