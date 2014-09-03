#!/usr/bin/env node

var Hero = require(__dirname + '/../app/hero');
var hero = new Hero();
hero.pull().then(function() {
    console.log('DONE');
});
