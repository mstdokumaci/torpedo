
var torpedo = require('../catch_me');

describe('Torpedo', function () {
	it('calculates impact location', function () {
		var target_location = {longitude: 29.049588, latitude: 40.976345};
		var destination_location = {longitude: 29.021666, latitude: 41.026785};
		var target_destination_duration = 1; // h
		var source_location = {longitude: 29.060103, latitude: 41.001693};
		var source_speed = 4; // km / h

		torpedo.accuracy(5);

		var impact = torpedo.impact(
		  target_location,
		  destination_location,
		  target_destination_duration,
		  source_location,
		  source_speed
		);

		expect(impact.location).not.toBeNull();
		expect(impact.duration).not.toBeNull();

		var torpedo_impact_distance = torpedo.distance_in_km(source_location, impact.location);
		var torpedo_impact_duration = torpedo_impact_distance / source_speed;

		var diff = Math.abs(torpedo_impact_duration - impact.duration);
		var min = Math.min(torpedo_impact_duration, impact.duration);
		expect(diff / min).toBeLessThan(1e-3);

		var target_impact_distance = torpedo.distance_in_km(target_location, impact.location);
		var target_speed = torpedo.distance_in_km(target_location, destination_location) / target_destination_duration;
		var target_impact_duration = target_impact_distance / target_speed;

		var diff = Math.abs(target_impact_duration - impact.duration);
		var min = Math.min(target_impact_duration, impact.duration);
		expect(diff / min).toBeLessThan(1e-3);
	});	
});
