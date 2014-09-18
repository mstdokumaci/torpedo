torpedo
=======

We start moving with contsant speed of S from location A, in order to catch a moving object with constant speed from location B to location C. The target object is going to arrive location C at the time of T. We won't be able to catch it before reaching destination if we are not fast enough.

## How to install
```sh
npm install torpedo
```

## How to use
If we are able to catch the target object, function returns the impact json; otherwise it returns null.
```js
var torpedo = require('torpedo');

var impcat = torpedo.catches_at(
  {longitude: 29.049588, latitude: 40.976345}, // target location (B)
  {longitude: 29.021666, latitude: 41.026785}, // destination location (C)
  +new Date() + 3600 * 1000, // destination reaching time (T - GMT timestamp in microseconds)
  {longitude: 29.060103, latitude: 41.001693}, // source location (A)
  4 // source speed (S - km / h)
);
```

returned impact json:
```json
{
	"location": {"longitude": 29.034545174320822, "latitude": 41.003529705337094},
	"duration_before": 0.5389347387955006
}
```
