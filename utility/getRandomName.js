const COURIERNAMES = require("../data/" + process.env.COURIERNAMES).names;

/**
 * Retrieves a random name from the COURIERNAMES file specified by our dotenv.
 */

module.exports = () => {
  return COURIERNAMES[Math.floor(Math.random() * COURIERNAMES.length)];
};
