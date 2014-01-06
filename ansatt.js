var request = require('request');
var async = require('async');

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
            employeesResponse.forEach(function(employee) {
                employees[employee.Name] = employee;
            });
            console.log('done');
        });
    });
}

function get(name) {
    console.log(name, employees[name]);
    return employees[name];
}

module.exports = {
    all: all,
    get: get
};