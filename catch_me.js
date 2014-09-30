
var turf = require('turf');

var accuracy = 5;

exports.accuracy = function (acc) {
	accuracy = acc;
}

exports.impact = function (target_location, dest_location, target_destination_duration, source_location, source_speed) {
	var tlon_slat = {latitude: source_location.latitude, longitude: target_location.longitude};
	var tlat_slon = {latitude: target_location.latitude, longitude: source_location.longitude};

	var t_lon_dist = (distance_in_km(target_location, tlat_slon) + distance_in_km(tlon_slat, source_location)) / 2;
	var t_lat_dist = (distance_in_km(target_location, tlon_slat) + distance_in_km(tlat_slon, source_location)) / 2;

	if (source_location.longitude > target_location.longitude) t_lon_dist *= -1;
	if (source_location.latitude > target_location.latitude) t_lat_dist *= -1;

	var dlat_tlon = {latitude: dest_location.latitude, longitude: target_location.longitude};
	var dlon_tlat = {latitude: target_location.latitude, longitude: dest_location.longitude};

	var i_lon_dist = (distance_in_km(target_location, dlon_tlat) + distance_in_km(dlat_tlon, dest_location)) / 2;
	var i_lat_dist = (distance_in_km(target_location, dlat_tlon) + distance_in_km(dlon_tlat, dest_location)) / 2;

	if (target_location.longitude > dest_location.longitude) i_lon_dist *= -1;
	if (target_location.latitude > dest_location.latitude) i_lat_dist *= -1;

	var i_lon_speed = i_lon_dist / target_destination_duration;
	var i_lat_speed = i_lat_dist / target_destination_duration;

	var t = catch_time(t_lon_dist, t_lat_dist, i_lon_speed, i_lat_speed, source_speed);

	var impact_location = null;

	if (t && t < target_destination_duration) {
		impact_location = midpoint_location(target_location, dest_location, t / target_destination_duration);
	}

	return {
		location: impact_location,
		duration: t
	};
};

function distance_in_km (location1, location2) {
	var point1 = turf.point(location1.longitude, location1.latitude);
	var point2 = turf.point(location2.longitude, location2.latitude);

	return turf.distance(point1, point2, 'kilometers');
}
exports.distance_in_km = distance_in_km;

function midpoint_location (from_location, to_location, ratio) {
	var point1 = turf.point(from_location.longitude, from_location.latitude);
	var point2 = turf.point(to_location.longitude, to_location.latitude);

	var distance = distance_in_km(from_location, to_location);
	var midpoint;

	if (ratio == 0.5 || distance > 5 / accuracy) {
		midpoint = turf.midpoint(point1, point2);
		midpoint = {
			longitude: midpoint.geometry.coordinates[0],
			latitude: midpoint.geometry.coordinates[1]
		};

		if (ratio == 0.5)
			return midpoint
		else if (ratio < 0.5)
			return midpoint_location(from_location, midpoint, ratio  * 2);
		else
			return midpoint_location(to_location, midpoint, (1 - ratio) * 2);
	} else {
		if (ratio > 0.5) {
			var swap = point1;
			point1 = point2;
			point2 = swap;
			ratio = 1 - ratio;
		}

		var bearing = turf.bearing(point1, point2);

		var destination = turf.destination(point1, ratio * distance, bearing, 'kilometers');

		return {
			longitude: destination.geometry.coordinates[0],
			latitude: destination.geometry.coordinates[1]
		};
	}
}
exports.midpoint_location = midpoint_location;

function catch_time (x, y, vx, vy, v) {
	var a = vx * vx + vy * vy - v * v;
	var b = 2 * (vx * x + vy * y);
	var c = x * x + y * y;

	var time = null;

	var ts = quad(a, b, c);

	if (ts) {
		var t = Math.min(ts[0], ts[1]);
		if (t < 0) t = Math.max(ts[0], ts[1]);
		if (t > 0) time = t;
	}

	return time;
}

function quad (a, b, c) {
	var sol = null;

	if (Math.abs(a) < 1e-6) {
		if (Math.abs(b) < 1e-6) {
			sol = Math.abs(c) < 1e-6 ? [0,0] : null;
		} else {
			sol = [ -c / b, -c / b];
		}
	} else {
		var disc = b * b - 4 * a * c;

		if (disc >= 0) {
			disc = Math.sqrt(disc);
			a = 2 * a;
			sol = [( -b - disc) / a, ( -b + disc) / a];
		}
	}

	return sol;
}
