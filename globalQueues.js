//Initiate counter elements to track size changs in our various global queues.

var TQueueCounter = 0;
var RQueueCounter = 0;
var WQueueCounter = 0;
var OQueueCounter = 0;

/*** 
 *  Construct a proxy that will basically trigger on any property change/addition of a given object.

 */
let observe = (obj, fn) =>
  new Proxy(obj, {
    set: function (target, property, value, receiver) {
      target[property] = value;
      fn(obj);
      return true;
    },
  });



/***
 *
 * The global queues we construct below are fundamentally ordinary arrays with a Proxy object superimposed
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
 *
 * This allows us to essentially add a change handler to each array.
 *
 * In a production scenarion, there are of course much more battle hardened queue frameworks readily available, which do not
 * hinge on the use of globally accessible arrays; but for our purposes here they will do fine.
 * */

global.TravellingCourierQueue = observe([], () => {
  if (TravellingCourierQueue.length != TQueueCounter) {
    TQueueCounter = TravellingCourierQueue.length;
  }
});

global.ReadyCourierQueue = observe([], () => {
  if (ReadyCourierQueue.length != RQueueCounter) {
    RQueueCounter = ReadyCourierQueue.length;
    console.log("a worker became ready")

  }
});

global.WaitingCourierQueue = observe([], () => {
  if (WaitingCourierQueue.length != WQueueCounter) {
    WQueueCounter = TravellingCourierQueue.length;
  }
});

global.OrderQueue = observe([], () => {
  if (OrderQueue.length != OQueueCounter) {
    OQueueCounter = OrderQueue.length;

  }
});
