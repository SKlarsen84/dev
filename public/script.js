var socket = io();

//Launch Vue app instance.
let vue = new Vue({
  el: "#app",

  data: {
    couriers_pending: [],
    couriers_ready: [],
    orders_pending: [],
    orders_ready: [],
    courier_times: [],
    order_times: [],
    order_average: 0,
    courier_average: 0,
    strategy: "",
  },

  created() {
    window.onbeforeunload = () => {
      socket.emit("leave", this.username);
    };

    //Handle all our socket events and feed our data back to vue.
    socket.on("queues", (queues) => {
      this.couriers_pending = queues.TravellingCourierQueue;
      this.couriers_ready = queues.ReadyCourierQueue;
      this.orders_pending = queues.OrderQueue;
      this.orders_ready = queues.OrdersForPickup;
    });

    socket.on("logmessage", (msg) => {
      $("#console").append(msg + "\n");
      let console = $("#console");
      if (console.length)
        console.scrollTop(console[0].scrollHeight - console.height());
    });

    socket.on("courier_finish", (msg) => {
      let waitTime = msg.courier.finishTime - msg.courier.readyTime;
      let courier = msg.courier.name;

      //push our waitTime to the averaging array.
      this.courier_times.push(waitTime);
      this.courier_average =
        this.courier_times.reduce((a, b) => a + b, 0) /
        this.courier_times.length;

      $("#courierWaitTimes").append(
        courier + " wait: " + waitTime + " ms" + "\n"
      );
      let courierWaitTimesLog = $("#courierWaitTimes");
      if (courierWaitTimesLog.length)
        courierWaitTimesLog.scrollTop(
          courierWaitTimesLog[0].scrollHeight - courierWaitTimesLog.height()
        );
    });

    socket.on("order_finish", (msg) => {
      let waitTime = msg.order.finishTime - msg.order.readyTime;
      let order = msg.order.name;

      //push our waitTime to the averaging array.
      this.order_times.push(waitTime);

      //update our order average
      this.order_average =
        this.order_times.reduce((a, b) => a + b, 0) / this.order_times.length;

      $("#orderWaitTimes").append(order + " wait: " + waitTime + " ms" + "\n");

      let orderWaitTimesLog = $("#orderWaitTimes");
      if (orderWaitTimesLog.length)
        orderWaitTimesLog.scrollTop(
          orderWaitTimesLog[0].scrollHeight - orderWaitTimesLog.height()
        );
    });
  },

  watch: {
    //no watching needed for our purposes
  },

  methods: {
    //none needed
  },
});

async function uploadOrders(options) {
  var slider = document.getElementById("jobRange");

  (vue.couriers_pending = []),
    (vue.couriers_ready = []),
    (vue.orders_pending = []),
    (vue.orders_ready = []),
    (vue.courier_times = []),
    (vue.order_times = []),
    (vue.order_average = 0),
    (vue.courier_average = 0),
    (vue.strategy = "");

  //read the range slider for desired number of jobs pr. second.

  var ordersPrSecond = slider.value / 1;

  let slicedOrders = [];
  let strategy = options.strategy;
  vue.strategy = strategy;
  console.log(
    "Starting " + strategy + " jobs at a rate of " + ordersPrSecond + "/second"
  );

  $.getJSON("orders.json", function (orders) {
    //split our orders object into an array of arrays sized to fit our ordersPrSecond
    orders.reduce(function (result, value, index, orders) {
      if (index % ordersPrSecond === 0)
        slicedOrders.push(orders.slice(index, index + ordersPrSecond));
      return result;
    }, []);

    var loop = setInterval(
      function () {
        if (slicedOrders.length > 0) {
          //hide our controls since we are still running
          $("#controls").hide();
          postOrderToApi(slicedOrders.slice(0, 1), strategy);
          slicedOrders.shift();
        } else {
          $("#controls").show();
          clearInterval(loop);
        }
      },
      1000,
      slicedOrders
    );
  }).fail(function () {
    console.log("An error has occurred.");
  });
}

function postOrderToApi(orders, strategy) {
  //we need to unpack the spliced array a bit
  let orderArray = orders[0];

  //iterate through every order in the orders array
  orderArray.forEach((order) => {
    //if we are running a matched strategy (and not a fifo), we need to specify designatedCourier as true for the Api ( see /swagger documentation)
    if (strategy === "matched") {
      order.designatedCourier = true;

      //also color the button headers for a visual cue as to what strategy is running
      $(".card-header.strategyheader").css("background-color", "#bcf1c8");
    } else {
      $(".card-header.strategyheader").css("background-color", "#c5d5fd");
    }

    $.post("/api/v1/order", order).done(function (data) {
      if (data.status === "received") {
        return "ok";
      } else {
        return "failed";
      }
    });
  });
}

//Set up the order/second slider.
var slider = document.getElementById("jobRange");
var output = document.getElementById("ordernumber");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  console.log(this.value);
  output.innerHTML = this.value;
};
