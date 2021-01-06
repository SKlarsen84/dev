# Kitchen/Courier Challenge 🚀


![Kitchen/Courier analytics frontend](https://i.imgur.com/FYcWLla.png)
This is a suggestion for a framework that can handle the Kitchen/Courier challenge; 

### Description:
> Implements a real-time system that simulates the fulfillment of delivery orders for a kitchen.
> The system receives a user-specified (default: 2) number of delivery orders per second.

> Each order takes some time (defined as `prepTime` in order JSON) to be prepared. 
> Once an order is prepared, it is waiting and ready for courier pickup.

>Upon receiving an order, the system should immediately dispatch a courier to pick it up.
>Couriers arrive randomly following a uniform distribution, 3-15 seconds after they’ve been dispatched. 
>Couriers have to wait at the kitchen if the order they are picking up is not ready.
>Once a courier picks up an order it is instantaneously delivered.

>The user can use the front-end analytics tool to gauge the performance metrics of 2 different delivery/pickup strategies
>Matched: a courier is dispatched for a specific order and may only pick up that order
>First-in-first-out: a courier picks up the next available order upon arrival. If there are multiple orders available, pick up an arbitrary order. 



### Solution features
- NodeJs/Express backend with a custom queueing system for handling orders/couriers in a simulated resturant.
- The backend recives order requests and handles courier/order events via their respective classes.
- Swagger documentation for the API is available at localhost:port/Swagger while the app is running.
- Frontend tool for analysis of courier/order performance, built with Vue.
- The queues and order/courier classes emit relevant events to any client (e.g. the analytics frontend) via. websockets for realTime statistics/event tracking
- The frontend/analytics tool can be used to run tests for different strategies with. different order-loads in real time.
- Backend provides analytics tool with a real-time feed of the stdout log for debugging/evaulation directly in the browser


##### Note:
the queue/worker implementation presented in this application is **not** battle-hardened, and should **not** be used in production.*
The aim of the application is to implement a custom queue/worker data structure and operationalize it.

For production purposes, you'd be better off using a  production ready queue/worker library such as [bull/redis](https://github.com/OptimalBits/bull).



## Getting Started
These instructions will get you a copy of the project up and running on your local machine.

##### Prerequisites

- nodeJS > 8.0
- chrome / any modern web browser

First clone the repo: `git clone https://github.com/SKlarsen84/dev.git kitchencourier`

Then cd into the /kitchencourier folder and run: `npm install`

Once npm install is done, start the application via `npm run start`


## Built With

* [NodeJS/Express](https://expressjs.com/) - Backend/Api
* [Swagger.io](https://swagger.io/) - API documentation
* [VueJS](https://vuejs.org/) - Frontend/Analytics tool
* [JSdoc](https://github.com/jsdoc/jsdoc) - class documentation

## Authors

* **Stefan K. Larsen** - *s.k.larsen84@gmail.com* - [Linkedin](https://www.linkedin.com/in/stefan-larsen-806b16114/)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* The good people at [ka-ching](https://ka-ching.dk/)
