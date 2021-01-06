//Initialise our .dotenv and basic consts
require("dotenv").config();
const server = require("./server");
const PORT = process.env.PORT || 3000;
const io = require("socket.io")(server);

//add console.log emitter to notifiy our socket clients about console log events.
require("./utility/consoleLog_emitter")(io);

/******
globalQueues hold all information about orders and incoming/working couriers.
They also responsible for updating any client listeners on their state via socket.io emissions.

in production we'd be using a battle-hardened queue/storage system such as bull/redis for this rather than globals.
 */
require("./globalQueues")(io);

server.listen(PORT, () => {
  console.log("Express server running on " + PORT);
});
