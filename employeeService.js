var db = require('./db');

function store(employees, callback){
	db.collection('employees').insert(employees, callback);
}

function all(callback) {
	db.collection('employees').find().toArray(callback);
}

module.exports = {
    all: all,
    store: store
};