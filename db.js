var MongoClient = require('mongodb').MongoClient;

var mongoUri = process.env.MONGOLAB_URI;

var database;

function connect(callback) {
	if (database) callback(null);
	MongoClient.connect(mongoUri, function(error, db) {
		database = db;
		callback(error);
	});
}

function collection(collectionName) {
	return database.collection(collectionName);
}

module.exports = {
	connect: connect,
	collection: collection
};