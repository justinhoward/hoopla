'use strict';

function Hoopla() {
    this._listeners = {};
    this._negativeListeners = {};
    this._sorted = {};
}
var proto = Hoopla.prototype;

proto.dispatch = function(eventName) {
    if (!this.hasListeners(eventName)) {
        return;
    }

    var args = Array.prototype.slice.call(arguments, 1);
    this.getListeners(eventName).forEach(function(listener) {
        listener.apply(null, args);
    });
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

module.exports = Hoopla;