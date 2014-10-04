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
    "name": "John S. Suah",
    "uuid": "ef5bc430-cf61-4bb5-9abf-4ed16bad0a1e",
    "groups": ["gCHV: Community Focal Person"],
//    "urns": ["tel:+231886333523"],
//    "urns": ["tel:+231886333524"],
    "fields": {"globalid": "urn:x-excelfile:Bong.xlsx:gCHV:provider:3"},
    "phone": "+231886333523"
});


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
