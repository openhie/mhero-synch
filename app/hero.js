var fs = require('fs');

var Practitioner = require(__dirname + '/practitioner');
var Location = require(__dirname + '/location');
var Organisation = require(__dirname + '/organisation');

var runDir = __dirname + '/../run';
var cacheFile = runDir + '/contacts.json';

var Config = require(__dirname + '/config');
var config = new Config();

function writeToCache(contacts) {
    fs.writeFileSync(cacheFile, JSON.stringify(contacts));
}

function readFromCache() {
    var rawJson = fs.readFileSync(cacheFile);
    return JSON.parse(rawJson);
}

function postContactToRapidPro(rapidProContactEndPoint, contact, logFile) {
    var request = require('request');

    function logFailure(body) {
        process.stdout.write('E');
        logFile.write('============\n'
            + '--> pushing data\n'
            + JSON.stringify(contact) + '\n'
            + '<-- getting response\n'
            + body + '\n');
    }

    request.post({
        headers: {
            'content-type': 'application/json',
            Authorization: 'Token ' + config.rapidProAuthorisationToken
        },
        url: rapidProContactEndPoint,
        body: JSON.stringify(contact)
    }, function (error, response, body) {
        try {
            var responseContact = JSON.parse(body);
            if (responseContact.phone) {
                process.stdout.write('.');
            } else {
                logFailure(body);
            }
        } catch (error) {
            logFailure(body);
        }
    });
}

var Hero = function () {
    this.pull = function () {
        var practitionerEndPoint = config.practitionerEndPoint;
        var locationEndPoint = config.locationEndPoint;
        var organisationEndPoint = config.organisationEndPoint;

        return Practitioner.loadAll(practitionerEndPoint).then(function (allPractitioners) {
            return Location.loadAll(locationEndPoint).then(function (allLocations) {
                return Organisation.loadAll(organisationEndPoint).then(function (allOrganisations) {
                    var mergedPractitioners = Practitioner.merge(allPractitioners, allLocations, allOrganisations);
                    console.log(mergedPractitioners.length.toString() + ' practitioners downloaded from HWR');
                    var allContacts = Practitioner.formatForRapidPro(mergedPractitioners);
                    writeToCache(allContacts);
                    console.log(allContacts.length.toString() + ' contacts put into cache');
                });
            });
        });
    };

    this.push = function () {
        var rapidProContactEndPoint = config.rapidProContactEndPoint;
        var allContacts = readFromCache();

        var logFile = fs.createWriteStream(runDir + '/push.log', {flags: 'w'});

        allContacts.forEach(function (contact) {
            postContactToRapidPro(rapidProContactEndPoint, contact, logFile);
        });
    };
};

module.exports = Hero;