/***
 *
 * The global queues we construct below are fundamentally ordinary arrays with a Proxy object superimposed
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
 *
 * In a production scenario, there are of course much more battle hardened queue frameworks readily available, which do not
 * hinge on the use of global arrays; but for our purposes here they will do fine;
 *
 * While most of the logic surrounding the actual handling of queue content is delegated to their classes, the queues themselves
 * will serve as event emitters  via socket.io;
 * */


//proxy that will  trigger on any property change/addition of a given object.
let observe = (obj, fn) =>
  new Proxy(obj, {
    set: function (target, property, value, receiver) {
      target[property] = value;
      //   if (property != "length") {
      fn(obj);
      //   }
      return true;
    },
  });

module.exports = function (io) {
  global.TravellingCourierQueue = observe(new Array(), () => {
    emitQueueStatus(io);
  });

  global.ReadyCourierQueue = observe(new Array(), async () => {
    emitQueueStatus(io);
  });

  global.OrderQueue = observe(new Array(), () => {
    emitQueueStatus(io);
  });

  global.OrdersForPickup = observe(new Array(), async () => {
    //if something happens with our order queue, emit this to any client that may want to know.
    emitQueueStatus(io);
  });
};

function emitQueueStatus(io) {
  io.emit("queues", {
    TravellingCourierQueue,
    ReadyCourierQueue,
    OrderQueue,
    OrdersForPickup,
  });
}
