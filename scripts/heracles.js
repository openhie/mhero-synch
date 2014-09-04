#!/usr/bin/env node

var exec = require('child_process').exec;
exec('rm -f ' + __dirname + '/run/contacts.json');

var Hero = require(__dirname + '/../app/hero');
var hero = new Hero();
hero.pull().then(function () {
    console.log('DONE');
}).catch(function (error) {
    console.error(error);
});
