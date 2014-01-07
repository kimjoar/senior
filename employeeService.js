var db = require('./db');

function store(employees, callback){
	db.collection('employees').insert(employees, function(error, results){
		if(error) callback(error);
		else callback(null);
	});
}

function all(callback) {
	db.collection('employees').find().toArray(function(error, result){
		if(error) callback(error);
		else callback(null, result);
	});
}

module.exports = {
    all: all,
    store: store
};