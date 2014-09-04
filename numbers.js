#!/usr/bin/env node

var fs = require('fs');

var rawJson = fs.readFileSync('run/contacts.json');
var allContacts = JSON.parse(rawJson);
allContacts.forEach(function (contact) {
    if (contact.phone != null) {
        console.log(contact.phone);
    }
});