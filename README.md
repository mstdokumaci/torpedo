torpedo
=======

Consider yourself in a U-Boat, which has a big fat freight ship on target. In order to hit the target for sure, you should do some calculations, which is covered by this library for any known location on earth. This library is useful if you are developing a game for longitude - latitude coordinates. It helps you auto-aiming any kind of projectile.

## How to install
```sh
npm install torpedo
```

## How to use
Our torpedo starts moving from source location of A to catch that big fat freight ship which is moving from target location B to destination location C. We know how long it takes to get location C for freight ship, because it  moves with a constant speed. So let's call that duration D. Our torpedo also has a constant speed of S, which should be enough to catch the ship in time. Function returns a json with impact location and duration. If our torpedo is not fast enough to catch the ship before it reaches location C, both impact location and duration returns null.

```js
var torpedo = require('torpedo');

var impcat = torpedo.catches_at(
  {longitude: 29.049588, latitude: 40.976345}, // target location (B)
  {longitude: 29.021666, latitude: 41.026785}, // destination location (C)
  1, // target to destination duration (D in hours)
  {longitude: 29.060103, latitude: 41.001693}, // source location (A)
  4 // source speed (S in km / h)
);
```

Returned json includes both impact location (in longitude and latitude) and duration (in hours):
```json
{
	"location": {
		"longitude": 29.034545174320822,
		"latitude": 41.003529705337094
	},
	"duration": 0.5389347387955006
}
```
