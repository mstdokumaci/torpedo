torpedo
=======

calculates location of catching a moving object on earth

## How to use

```js
catches_at(
  {longitude: 29.049588, latitude: 40.976345}, // target location
  {longitude: 29.021666, latitude: 41.026785}, // destination location
  +new Date() + 3600 * 1000, // destination reaching time
  {longitude: 29.060103, latitude: 41.001693}, // source location
  4 // source speed
);

// returns {latitude: 41.00353050364272, longitude: 29.034544732375366}
```

