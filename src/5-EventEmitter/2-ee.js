// In a restaurant, you have multiple roles (chef, server, cashier, etc.) performing tasks that are interconnected but independent. 
// Events like "order received" or "food ready" trigger specific actions for different roles. This kind of scenario is perfect for event-driven programming.

// We’ll create a system where:

//     A customer places an order.
//     A chef is notified to prepare the food.
//     Once the food is ready, the server is notified to deliver it.
//     The cashier is notified to print the bill.

const EventEmitter = require('events');

class Restaurant extends EventEmitter {
  takeOrder(order) {
    console.log(`Order received: ${order}`);
    this.emit('orderReceived', order); 
  }

  foodReady(order) {
    console.log(`Food ready for: ${order}`);
    this.emit('foodReady', order); 
  }

  completeOrder(order) {
    console.log(`Order completed: ${order}`);
    this.emit('orderCompleted', order); 
  }
}

// Instantiate the restaurant system
const restaurant = new Restaurant();

// Add listeners for different events
restaurant.on('orderReceived', (order) => {
  console.log(`Chef is preparing: ${order}`);
  // Simulate preparation delay
  setTimeout(() => restaurant.foodReady(order), 2000);
});

restaurant.on('foodReady', (order) => {
  console.log(`Server is delivering: ${order}`);
  // Simulate delivery delay
  setTimeout(() => restaurant.completeOrder(order), 1000);
});

restaurant.on('orderCompleted', (order) => {
  console.log(`Cashier is printing the bill for: ${order}`);
});

// Simulate customer orders
restaurant.takeOrder('Pasta');
restaurant.takeOrder('Pizza');
