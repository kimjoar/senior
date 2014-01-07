var db = require('./db');

function collection() {
	return db.collection('messages');
}

function store(message) {
	collection().insert(message, function(error) {
		if (error) console.log('Error caching message!', error);
	});
}

function get(id, callback) {
	collection().findOne({id: id}, function(error, message) {
		if (error) callback(error);
		else callback(error, message);
	});
}

module.exports = {
	store: store,
	get: get
};