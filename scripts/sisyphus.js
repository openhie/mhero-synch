#!/usr/bin/env node

var exec = require('child_process').exec;
exec('rm -f ' + __dirname + '/run/push.log');

console.log('START PUSHING');
var Hero = require(__dirname + '/../app/hero');
var hero = new Hero();
hero.push();
