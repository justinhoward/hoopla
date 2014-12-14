'use strict';

/**
 * A named event
 *
 * @param {string} name The name of the event
 * @param {object} [attributes] Custom attributes for the event
 */
function Event(name, attributes) {
    this._name = name;
    this._stopped = false;
    this._attrs = {};

    if (attributes) {
        this.setAttributes(attributes);
    }
}
var proto = Event.prototype;

/**
 * Get the event name
 *
 * @return {string} The event name
 */
proto.getName = function() {
    return this._name;
};

/**
 * Get an event attribute
 *
 * @param {string} name The attribute name
 * @return {mixed} The attribue value
 */
proto.get = function(name) {
    return this._attrs[name];
};

/**
 * Set an event attribute
 *
 * @param {string} name The attribute name
 * @param {mixed} value The attribute value
 * @return {this}
 */
proto.set = function(name, value) {
    this._attrs[name] = value;
    return this;
};

/**
 * Get an object containing all the event attributes
 *
 * @return {object} An object whose keys are attribute names and values are their values.
 */
proto.getAttributes = function() {
    return this._attrs;
};

/**
 * Set event attributes from an object whose keys are attribute names.
 * The values will be merged with existing attributes.
 *
 * @param {object} attributes The attributes to set
 */
proto.setAttributes = function(attributes) {
    for (var key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            this.set(key, attributes[key]);
        }
    }
};

/**
 * Check if the given attribute is set
 *
 * @param {string} name The attribute name
 * @return {boolean} True if the attribute is set, false if not
 */
proto.has = function(name) {
    return this._attrs.hasOwnProperty(name);
};

/**
 * Stop propagation for this event. Additional listeners will
 * not be called.
 *
 * @return {this}
 */
proto.stopPropagation = function() {
    this._stopped = true;
    return this;
};

/**
 * Check if propagation is stopped
 *
 * @return {boolean} True if propagation is stopped, false if not.
 */
proto.isPropagationStopped = function() {
    return this._stopped;
};

module.exports = Event;