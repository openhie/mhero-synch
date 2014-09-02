var Practitioner = require(__dirname + '/../../app/practitioner');
var fs = require('fs');

var Fixtures = {
    practitioners: function () {
        var file = __dirname + '/practitioners.json';
        var rawJson = fs.readFileSync(file, 'utf8');
        var practitionersInJson = JSON.parse(rawJson);
        return practitionersInJson.map(function (jsonObject) {
            var item = {
                'atom:content': {
                    '#': JSON.stringify(jsonObject)
                }
            };
            return new Practitioner(item);
        });
    }
};

module.exports = Fixtures;