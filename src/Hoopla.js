'use strict';

var Event = require('./Event');

/**
 * The Hoopla event dispatcher
 */
function Hoopla() {
    this._listeners = {};
    this._negativeListeners = {};
    this._sorted = {};
}
var proto = Hoopla.prototype;

/**
 * Dispatch an event and call its listeners in order of priority.
 *
 * @param {Event|string} event The Event object to dispatch, or the event name
 * @param {object} [attributes] If passing an event name, the attributes for the event
 * @return {this}
 */
proto.dispatch = function(event) {
    if (typeof event === 'string') {
        event = this.createEvent(event, arguments[1]);
    }
    var eventName = event.getName();

    if (!this.hasListeners(eventName)) {
        return;
    }

    var listeners = this.getListeners(eventName);
    var i = 0, iLen = listeners.length;
    for (; i < iLen; i++) {
        if (event.isPropagationStopped()) {
            break;
        }
        listeners[i].call(this, event);
    }
};

/**
 * Add a listener for `eventName`
 *
 * @param {string} eventName The name of the event to listen to
 * @param {function} listener The function to be called when the event is dispatched
 * @param {integer} priority The priority of the listener where lower numbers are
 *     called first. Negatives are allowed.
 * @return {this}
 */
proto.addListener = function(eventName, listener, priority) {
    var listeners;
    if (typeof priority === 'undefined') {
        priority = 0;
        listeners = this._listeners;
    } else if (priority < 0) {
        listeners = this._negativeListeners;
        priority = -priority;
    } else {
        listeners = this._listeners;
    }


    if (!listeners[eventName]) {
        listeners[eventName] = [];
    }
    if (!listeners[eventName][priority]) {
        listeners[eventName][priority] = [];
    }
    listeners[eventName][priority].push(listener);

    delete this._sorted[eventName];
    return this;
};

/**
 * Get the listener functions for `eventName` in order of priority
 *
 * @param {string} eventName The name of the event to get listeners for
 * @return {array[function]} An array of listeners
 */
proto.getListeners = function(eventName) {
    if (this._sorted[eventName]) {
        return this._sorted[eventName];
    }

    var priorities = (this._negativeListeners[eventName] || []).reverse().concat(this._listeners[eventName] || []);
    var sorted = [];

    priorities.forEach(function(listeners) {
        listeners.forEach(function(listener) {
            sorted.push(listener);
        });
    });

    this._sorted[eventName] = sorted;
    return sorted;
};

/**
 * Check whether the given `eventName` has any listeners
 *
 * @param {string} eventName The name of the event to check
 * @return {boolean} True if the event has listeners, false if not
 */
proto.hasListeners = function(eventName) {
    return !!this.getListeners(eventName).length;
};

/**
 * Create an Event object
 *
 * @param {string} eventName The name of the event
 * @param {object} [attributes] Attributes to set on the Event
 * @return {Event} The created Event
 */
proto.createEvent = function(eventName, attributes) {
    return new Event(eventName, attributes);
};

module.exports = Hoopla;