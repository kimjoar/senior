var request = require('request');
var async = require('async');
var _ = require('underscore');

var employeeUrl = process.env.ANSATTLISTE_URL;
var employees = {};

function employeeParams(url) {
    return {
        url: employeeUrl + url,
        json: true
    };
}

function all() {
    request.get(employeeParams('/all'), function(error, response, employeesResponse) {
        if (error) {
            return console.log(error);
        }

        var all = employeesResponse.map(function(employee) {
            var id = employee.Id;

            return function(callback) {
                request.get(employeeParams('/employee/'+id), function(error, response, body) {
                    callback(error, body[0]);
                });
            };
        });

        async.parallel(all, function(error, employeesResponse) {
            console.log('done');
            employeesResponse.forEach(function(employee) {
                employees[employee.Name] = employee;
            });
        });
    });
}

function get(name) {
    if (employees[name]) return employees[name];

    return _.find(employees, function(ansatt) {
        var i = _.intersection(name.split(" "), ansatt.Name.split(" "));
        return i.length >= 2;
    });
}

module.exports = {
    all: all,
    get: get
};
