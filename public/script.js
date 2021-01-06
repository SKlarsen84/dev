var socket = io();

let vue = new Vue({
  el: "#app",

  data: {
    couriers_pending: [],
    couriers_ready: [],
    orders_pending: [],
    orders_ready: [],
  },

  created() {
    window.onbeforeunload = () => {
      socket.emit("leave", this.username);
    };

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
  },

  watch: {
    //no watching needed for our purposes
  },

  methods: {
    //none needed
  },
});

//Initiate orderData.json and make it accessible.
function getOrderData(filename) {
  $.getJSON(filename, function (data) {
    return data;
  }).fail(function () {
    console.log("An error has occurred.");
  });
}

//function for uploading orders
async function uploadOrders(options) {
  let slicedOrders = [];
  let ordersPrSecond = options.ordersPrSecond || 2;
  let strategy = options.strategy;

  $.getJSON("orders.json", function (orders) {
    //split our orders object into an array of arrays sized to fit our ordersPrSecond
    orders.reduce(function (result, value, index, orders) {
      if (index % ordersPrSecond === 0)
        slicedOrders.push(orders.slice(index, index + ordersPrSecond));
      return result;
    }, []);

    setInterval(
      function () {
        if (slicedOrders.length > 0) {
          postOrderToApi(slicedOrders.slice(0, 1), strategy);
          slicedOrders.shift();
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
    console.log(order);

    //if we are running a matched strategy (and not a fifo), we need specify designatedCourier as true for the Api ( see /swagger documentation)
    if (strategy === "matched") {
      order.designatedCourier = true;
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
