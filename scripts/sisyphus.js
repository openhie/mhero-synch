#!/usr/bin/env node

console.log('START PUSHING');
var Hero = require(__dirname + '/../app/hero');
var hero = new Hero();
hero.push();
