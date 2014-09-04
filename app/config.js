var Config = function(env) {
    env = env || 'staging'; // TODO: this should be 'production' once we move to prod
    var fs = require('fs');
    var rawJson = fs.readFileSync(__dirname + '/../config/hero-config.' + env + '.json');
    return JSON.parse(rawJson);
};

module.exports = Config;