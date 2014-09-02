var fs = require('fs');

var Practitioner = require(__dirname + '/../../app/practitioner');
var Location = require(__dirname + '/../../app/location');
var Organisation = require(__dirname + '/../../app/organisation');

function loadFixtures(modelClass, fixtureFile) {
    var rawJson = fs.readFileSync(fixtureFile, 'utf8');
    var practitionersInJson = JSON.parse(rawJson);
    return practitionersInJson.map(function (jsonObject) {
        var item = {
            'atom:content': {
                '#': JSON.stringify(jsonObject)
            }
        };
        return new modelClass(item);
    });
}

var Fixtures = {
    practitioners: function () {
        return loadFixtures(Practitioner, __dirname + '/practitioners.json');
    },
    locations: function () {
        return loadFixtures(Location, __dirname + '/locations.json');
    },
    organisations: function () {
        return loadFixtures(Organisation, __dirname + '/organisations.json');
    }
};

module.exports = Fixtures;