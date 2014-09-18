
var torpedo = require('../catch_me');

console.log('a');

describe('Torpedo', function () {
	it('calculates impact location', function () {
		var target_location = {longitude: 29.049588, latitude: 40.976345};
		var destination_location = {longitude: 29.021666, latitude: 41.026785};
		var now = +new Date()
		var destination_duration = 1; // h
		var destination_time = now + destination_duration * 3600 * 1000;
		var source_location = {longitude: 29.060103, latitude: 41.001693};
		var source_speed = 4; // km / h

		var impact_location = torpedo.catches_at(
		  target_location,
		  destination_location,
		  destination_time,
		  source_location,
		  source_speed
		);

		var torpedo_travel_distance = torpedo.distance_in_km(source_location, impact_location);
		var torpedo_travel_duration = torpedo_travel_distance / source_speed;

		var target_travel_distance = torpedo.distance_in_km(target_location, impact_location);
		var target_speed = torpedo.distance_in_km(target_location, destination_location) / destination_duration;
		var target_travel_duration = target_travel_distance / target_speed;

		expect(torpedo_travel_duration).toEqual(target_travel_duration);
	});	
});
