#!/usr/bin/env node

//var post_data = JSON.stringify({
//    "name": "Jeff Xiong",
//    "phone": "+231888642008",
//    "groups": ["cool", "fancy"],
//    "fields": {
//        "globalId": "urn:dhis.org:liberia-training:csd:provider:dbQGGwj9Dke"
//    }
//});
var post_data = JSON.stringify({
    "name": "Tamba Idrissa",
    "phone": "+231880768763",
    "groups": ["Liberia, Grand Cape Mount", "Liberia", "Report administrator"],
    "fields": {
        "globalId": "urn:dhis.org:sierra-leone-demo:csd:provider:ejvfOQLwvrv",
        "facility": "Grand Cape Mount"
    },
    "cadres": ["Report administrator"]
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

console.log(post_data);

request.post({
    headers: {
        'content-type': 'application/json',
        Authorization: 'Token ' + config.authentication.rapidpro.token
    },
    url: 'https://rapidpro.io/api/v1/contacts.json',
    body: post_data
}, function (error, response, body) {
    console.log(body);
});
