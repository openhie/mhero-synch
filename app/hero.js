var fs = require('fs');

var Practitioner = require(__dirname + '/practitioner');
var Location = require(__dirname + '/location');
var Organisation = require(__dirname + '/organisation');

var runDir = __dirname + '/../run';
var cacheFile = runDir + '/contacts.json';

function writeToCache(contacts) {
    fs.writeFileSync(cacheFile, JSON.stringify(contacts));
}

function readFromCache() {
    var rawJson = fs.readFileSync(cacheFile);
    return JSON.parse(rawJson);
}

function postContactToRapidPro(rapidProContactEndPoint, contact) {
    var request = require('request');
    var config = require(__dirname + '/config.js');
    request.post({
        headers: {
            'content-type': 'application/json',
            Authorization: 'Token ' + config.rapidProAuthorisationToken
        },
        url: rapidProContactEndPoint,
        body: JSON.stringify(contact)
    }, function (error, response, body) {
        try {
            JSON.parse(body);
            process.stdout.write('.');
        } catch(error) {
            process.stdout.write('E');
            fs.appendFileSync(runDir + '/push.log', '============\n');
            fs.appendFileSync(runDir + '/push.log', '--> pushing data\n');
            fs.appendFileSync(runDir + '/push.log', JSON.stringify(contact) + '\n');
            fs.appendFileSync(runDir + '/push.log', '<-- getting response\n');
            fs.appendFileSync(runDir + '/push.log', body + '\n');
        }
    });
}

var Hero = function (options) {
    this.pull = function () {
        var practitionerEndPoint = options.practitionerEndPoint;
        var locationEndPoint = options.locationEndPoint;
        var organisationEndPoint = options.organisationEndPoint;

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
        var rapidProContactEndPoint = options.rapidProContactEndPoint;
        var allContacts = readFromCache();
        allContacts.forEach(function (contact, index) {
            // FIXME: don't do this once we can get number from HWR
            contact.phone = '+2507881' + paddy(index, 5);
            postContactToRapidPro(rapidProContactEndPoint, contact);
        });
    };
};

// FIXME: only for test!!!
function paddy(n, p, c) {
    var pad_char = typeof c !== 'undefined' ? c : '0';
    var pad = new Array(1 + p).join(pad_char);
    return (pad + n).slice(-pad.length);
}

module.exports = Hero;