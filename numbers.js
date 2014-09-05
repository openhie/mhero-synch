#!/usr/bin/env node

var fs = require('fs');

var rawJson = fs.readFileSync('run/contacts.json');
var allContacts = JSON.parse(rawJson);
allContacts.forEach(function (contact) {
    if (contact.phone) {
        console.log(contact.phone);
    }
});

console.log('=======');
console.log(allContacts.length + ' contacts in total');

var contactsWithPhoneNumber = allContacts.filter(function (contact) {
    return contact.phone;
});
console.log(contactsWithPhoneNumber.length + ' contacts has phone numbers');

contactsWithPhoneNumber.forEach(function (x) {
    var dup = allContacts.filter(function (y) {
        return x.phone == y.phone;
    });
    if(dup.length > 1) {
        contactsWithPhoneNumber.remove
    }
});