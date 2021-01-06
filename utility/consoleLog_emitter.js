/**
 * extends our console.log() a bit so as to also emit console events to socket.io clients
 *
 * In any sort of sane production environment we'd be using a battle hardened logging library
 * rather than jerry-rigging the console prototype.
 */

module.exports = function (io) {
  var exLog = console.log;
  console.log = function (msg) {
    exLog.apply(this, arguments);
    io.emit("logmessage", msg);
  };
};
