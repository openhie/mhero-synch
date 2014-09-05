#!/usr/bin/env node

var post_data = JSON.stringify({
    "name": "Jeff Xiong",
    "phone": "+231888642008",
    "groups": ["cool", "fancy"],
    "fields": {
        "globalId": "urn:dhis.org:liberia-training:csd:provider:dbQGGwj9Dke"
    }
});
//var post_data = JSON.stringify({
//    "name": "Triolapr Clihou",
//    "groups": ["Benguima Grassfield MCHP-Rural Western Area-Western Area-Sierra Leone"],
//    "phone": "+250788100006"
//});


// Set up the request
var request = require('request');
var Config = require(__dirname + '/../app/config.js');
var config = new Config();
request.post({
    headers: {
        'content-type': 'application/json',
        Authorization: 'Token ' + config.rapidProAuthorisationToken
    },
    url: 'https://rapidpro.io/api/v1/contacts.json',
    body: post_data
}, function (error, response, body) {
    console.log(body);
});
