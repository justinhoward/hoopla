# Hoopla

An event dispatcher for JavaScript that knows its priorities.

## Setup

```javascript
var Hoopla = require('hoopla');
var dispatcher = new Hoopla();
```

## Adding listeners

```javascript
dispatcher.addListener('something-changed', function(value) {
    console.log('it changed to ' + value);
});
```

## Dispatching events

```javascript
dispatcher.dispatch('something-changed', 'new value');
```