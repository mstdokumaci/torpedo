torpedo
=======

While we are on location A, we start moving with contsant speed of S, trying to catch an object moving with constant speed from location B to location C. The target object is going to arrive location C at the time of T. If we are not fast enough, we won't be able to catch it before reaching destination.

## How to use
If we are able to catch the target object, function returns the impact location; otherwise it returns null.
```js
var torpedo = require('torpedo');

torpedo.catches_at(
  {longitude: 29.049588, latitude: 40.976345}, // target location (B)
  {longitude: 29.021666, latitude: 41.026785}, // destination location (C)
  +new Date() + 3600 * 1000, // destination reaching time (T - GMT timestamp in microseconds)
  {longitude: 29.060103, latitude: 41.001693}, // source location (A)
  4 // source speed (S - km / h)
);

// returns {latitude: 41.00353050364272, longitude: 29.034544732375366}
```
