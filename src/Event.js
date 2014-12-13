'use strict';

function Event(name, attributes) {
    this._name = name;
    this._stopped = false;
    this._attrs = {};

    if (attributes) {
        this.setAttributes(attributes);
    }
}
var proto = Event.prototype;

proto.getName = function() {
    return this._name;
};

proto.get = function(name) {
    return this._attrs[name];
};

proto.set = function(name, value) {
    this._attrs[name] = value;
    return this;
};

proto.getAttributes = function() {
    return this._attrs;
};

proto.setAttributes = function(attributes) {
    for (var key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            this.set(key, attributes[key]);
        }
    }
};

proto.has = function(name) {
    return this._attrs.hasOwnProperty(name);
};

proto.stopPropagation = function() {
    this._stopped = true;
    return this;
};

proto.isPropagationStopped = function() {
    return this._stopped;
};

module.exports = Event;