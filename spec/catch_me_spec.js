
var torpedo = require('../catch_me');

describe('Torpedo', function () {
	it('calculates impact location', function () {
		var target_location = {longitude: 29.049588, latitude: 40.976345};
		var destination_location = {longitude: 29.021666, latitude: 41.026785};
		var destination_duration = 1; // h
		var source_location = {longitude: 29.060103, latitude: 41.001693};
		var source_speed = 4.5; // km / h

		var impact_location = torpedo.catches_at(
		  target_location,
		  destination_location,
		  destination_duration,
		  source_location,
		  source_speed
		);

		console.log(impact_location);

		var torpedo_travel_distance = torpedo.distance_in_km(source_location, impact_location);
		var torpedo_travel_duration = torpedo_travel_distance / source_speed;

		var target_travel_distance = torpedo.distance_in_km(target_location, impact_location);
		var target_speed = torpedo.distance_in_km(target_location, destination_location) / destination_duration;
		var target_travel_duration = target_travel_distance / target_speed;

		var diff = Math.abs(torpedo_travel_duration - target_travel_duration);
		var max = Math.max(torpedo_travel_duration, target_travel_duration);
		expect(diff / max).toBeLessThan(0.001);
	});	
});
