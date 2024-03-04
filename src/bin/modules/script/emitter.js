// eventsBroker.js

const EventEmitter = require('events');
const eventBroker = new EventEmitter();

module.exports = {
  emit: eventBroker.emit.bind(eventBroker),
  on: eventBroker.on.bind(eventBroker),
};
