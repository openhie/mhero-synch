#!/usr/bin/env node

var Hero = require(__dirname + '/../app/hero');

var hero = new Hero({rapidProContactEndPoint: 'https://rapidpro.io/api/v1/contacts.json'});

console.log('START PUSHING');
hero.push();
