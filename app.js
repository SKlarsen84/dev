//Initialise our .dotenv
require("dotenv").config();

//initialize our global queues
require("./globalQueues");

const PORT = process.env.PORT || 3000;
const Courier = require("./classes").Courier;


const server = require("./server");

server.listen(PORT, () => {
  console.log("Express server running on " + PORT);
});





for (let index = 0; index < 15; index++) {
  //new Courier();
}
