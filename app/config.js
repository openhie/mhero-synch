var Config = function() {
    var env = process.env.HERO_ENV || 'staging'; // TODO: this should be 'production' once we move to prod
    var fs = require('fs');
    var rawJson = fs.readFileSync(__dirname + '/../config/hero-config.' + env + '.json');
    var config = JSON.parse(rawJson);

    config.authentication = JSON.parse(fs.readFileSync(__dirname + '/../config/hero-auth-config.json'));

    return config;
};

module.exports = Config;