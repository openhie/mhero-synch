#!/usr/bin/env node

// Build the post string from an object
var post_data = JSON.stringify({
    "phone": "+250788123123",
    "name": "Ben Haggerty",
    "groups": ["cool", "fancy"]
});


// Set up the request
var request = require('request');
var config = require(__dirname + '/../app/config.js');
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
