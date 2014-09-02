var fs = require('fs');
var rawJson = fs.readFileSync(__dirname + '/../config/hero-config.json');
var configObject = JSON.parse(rawJson);

module.exports = configObject;