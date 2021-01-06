  /**
   * provides a passive shim to the console.prototype's log function that allows it to emit logged lines as events via socket
   * @function
   */

function consoleLog_emitter() {
  var exLog = console.log;
  console.log = function (msg) {
    exLog.apply(this, arguments);
    io.emit("logmessage", msg);
  };
}

module.exports = consoleLog_emitter