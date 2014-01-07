var request = require('request');
var db = require('./db');
var async = require('async');
var socialcast = require('./socialcast');
var _ = require('underscore');

function collection() {
	return db.collection('scaggregate');
}

function fetchFromSocialcastAndSaveToDB(page, cb) {
	console.log("henter socialcast side %d", page);
	socialcast.messages(page, function(err, messages) {
		console.log("ferdig socialcast side %d", page);
		collection().insert(messages, function() {
			console.log("side %d lagret i db", page);
			cb();
		});
	});
}

exports.start = function(callback) {
	collection().count(function(error, count) {
		if (count > 0) return callback(null);

		async.eachLimit(_.range(1, 100), 5,
			fetchFromSocialcastAndSaveToDB,
			function(error) {
				callback(error);
			}
		);
	});
};