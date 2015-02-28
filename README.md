# Hoopla [![npm version](https://badge.fury.io/js/hoopla.svg)](http://badge.fury.io/js/hoopla)

[![Build Status](https://travis-ci.org/justinhoward/hoopla.svg)](https://travis-ci.org/justinhoward/hoopla)
[![Code Climate](https://codeclimate.com/github/justinhoward/hoopla/badges/gpa.svg)](https://codeclimate.com/github/justinhoward/hoopla)
[![Test Coverage](https://codeclimate.com/github/justinhoward/hoopla/badges/coverage.svg)](https://codeclimate.com/github/justinhoward/hoopla)

An event dispatcher for JavaScript that knows its priorities.

Node's event-emitter package is fine for simple events, but if you get more than a
few listeners to a single event, it becomes difficult to manage. Hoopla allows you to
set priorities for your event handlers so they get called in a certain order.

## Creating a dispatcher

```javascript
var Hoopla = require('hoopla');
var dispatcher = new Hoopla();
```

## Basic events

Add listeners with the `addListener` method and fire events with `dispatch`.

```javascript
dispatcher.addListener('init', function() {
    console.log('it was initialized!');
});

dispatcher.dispatch('init');
// Prints 'it was initialized!'
```

## Event priority

Hoopla allows you to set an unlimited number of event listeners
for any event. By default, they all have a priority of 0, so they get
handled in the order they are registered. If you give a handler a negative or positive
priority, Hoopla will call the handlers in order from least to greatest.

```javascript
dispatcher.addListener('init', function() {
    console.log('default init handler');
});

dispatcher.addListener('init', function() {
    console.log('early init handler');
}, -5);

dispatcher.addListener('init', function() {
    console.log('late init handler');
}, 3);

dispatcher.dispatch('init');
// Prints 'early init handler', 'default init handler', 'late init handler'
```

## Event objects

Hoopla passes an `Event` object to your event listeners. Events are objects that have a name, and attributes.

```javascript
dispatcher.addListener('route', function(event) {
    if (event.getName() === 'route') {
        console.log(event.get('foo'));
    } else {
        event.set('foo', 3);
    }
});
```

If you pass an object as the second argument to `dispatch`, Hoopla will set its properties
as attributes on the event object.

```javascript
dispatcher.addListener('init', function(event) {
    console.log(event.get('foo')); // prints 'foo value'
});

dispatcher.dispatch('init', {foo: 'foo value'});
```

## Stopping propagation

Event listeners can stop propagation for an event meaning that event will not trigger any more listeners.

```javascript
dispatcher.addListener('init', function(event) {
   event.stopPropagation();
});

dispatcher.addListener('init', function() {
    // will not be called
}, 1);

dispatcher.dispatch('init');
```

## Creating an event object

If you wish, you can create an event object manually and pass it to the dispatch method.

```javascript
// Create an event with dispatcher.createEvent
var eventA = dispatcher.createEvent('foo', {a: 'a'});
// or create an event with the Event constructor
var eventB = new Hoopla.Event('bar', {b: 'b'});

dispatcher.dispatch(eventA);
dispatcher.dispatch(eventB);
```

You can create custom events objects. An event object must have `getName` and `isPropagationStopped` methods.

```javascript
var fooEvent = {
    getName: function() {
        return 'foo';
    },
    isPropagationStopped: function() {
        return false;
    }
};
dispatcher.dispatch(fooEvent);
```
