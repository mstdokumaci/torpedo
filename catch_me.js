
var turf = require('turf');

exports.calculate_distance = function distance (location1, location2) {
	var point1 = turf.point(location1.longitude, location1.latitude);
	var point2 = turf.point(location2.longitude, location2.latitude);

	return turf.distance(point1, point2, 'kilometers');
};

exports.find_midpoint = function midpoint (from_location, to_location, distance) {
	var point1 = turf.point(from_location.longitude, from_location.latitude);
	var point2 = turf.point(to_location.longitude, to_location.latitude);

	var bearing = turf.bearing(point1, point2);

	var destination = turf.destination(point1, distance, bearing, 'kilometers');

	return {
		longitude: destination.geometry.coordinates[0],
		latitude: destination.geometry.coordinates[1]
	};
};

exports.catches_at = function catches_at (target_location, dest_location, dest_time, source_location, source_speed) {
	var tlon_slat = {latitude: source_location.latitude, longitude: target_location.longitude};
	var tlat_slon = {latitude: target_location.latitude, longitude: source_location.longitude};

	var t_lon_dist = (distance(target_location, tlat_slon) + distance(tlon_slat, source_location)) / 2;
	var t_lat_dist = (distance(target_location, tlon_slat) + distance(tlat_slon, source_location)) / 2;

	if (source_location.longitude > target_location.longitude) t_lon_dist *= -1;
	if (source_location.latitude > target_location.latitude) t_lat_dist *= -1;

	var dlat_tlon = {latitude: dest_location.latitude, longitude: target_location.longitude};
	var dlon_tlat = {latitude: target_location.latitude, longitude: dest_location.longitude};

	var j_lon_dist = (distance(target_location, dlon_tlat) + distance(dlat_tlon, dest_location)) / 2;
	var j_lat_dist = (distance(target_location, dlat_tlon) + distance(dlon_tlat, dest_location)) / 2;

	if (target_location.longitude > dest_location.longitude) j_lon_dist *= -1;
	if (target_location.latitude > dest_location.latitude) j_lat_dist *= -1;

	var j_dist = distance(target_location, dest_location);

	// convert target journey time to hours because source speed is in km / h
	var j_time = (dest_time - new Date()) / 1000 / 3600;
	var j_lon_speed = j_lon_dist / j_time;
	var j_lat_speed = j_lat_dist / j_time;

	var t = catch_time(t_lon_dist, t_lat_dist, j_lon_speed, j_lat_speed, source_speed);

	return t && t < j_time ? midpoint(target_location, dest_location, j_dist * t / j_time) : null;
};

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
