#!/usr/bin/env node

var fs = require('fs');
var request = require('request');

var Config = require(__dirname + '/../app/config');
var config = new Config();

var rapidProFieldsEndPoint = config.rapidProAPIEndPoint + "/fields.json";


var fields  = 
    [
	{
	    "label": "globalid",
	    "value_type": "T"
	},	
	{
	    "label": "facility",
	    "value_type": "T"
	},

    ];



console.log('INITIALIZING WORKSPACE');


request.get({
    headers: {
        'content-type': 'application/json',
        Authorization: 'Token ' + config.authentication.rapidpro.token
    },
    url: rapidProFieldsEndPoint,

}, function (error, response, body) {
    try {
        console.log("Existing fields");
	console.log(JSON.parse(body));
    } catch (error) {
        console.log("could not request existing fields")
    }
});



function postFieldToRapidPro(rapidProFieldsEndPoint, field) {

    function logFailure(body) {
	console.log('============\n'
            + '--> pushing data\n'
            + JSON.stringify(contact) + '\n'
            + '<-- ERROR getting response\n'
            + body + '\n');
    }

    request.post({
        headers: {
            'content-type': 'application/json',
            Authorization: 'Token ' + config.authentication.rapidpro.token
        },
        url: rapidProFieldsEndPoint,
        body: JSON.stringify(field)
    }, function (error, response, body) {
        try {
            var responseField = JSON.parse(body);
            if (responseField.key) {
		console.log('Field ' + field.label + ' created with key '+ responseField.key);
            } else {
                logFailure(body);
            }
        } catch (error) {
            logFailure(body);
        }
    });
}



fields.forEach(function(field) {postFieldToRapidPro( rapidProFieldsEndPoint,field);});

