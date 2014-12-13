'use strict';

var Event = require('./Event');

function Hoopla() {
    this._listeners = {};
    this._negativeListeners = {};
    this._sorted = {};
}
var proto = Hoopla.prototype;

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

proto.hasListeners = function(eventName) {
    return !!this.getListeners(eventName).length;
};

proto.createEvent = function(name, attributes) {
    return new Event(name, attributes);
};

module.exports = Hoopla;