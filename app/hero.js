var fs = require('fs');
//var request = require('request');
var syncrequest = require('sync-request');

var Practitioner = require(__dirname + '/practitioner');
var Location = require(__dirname + '/location');
var Organisation = require(__dirname + '/organisation');

var runDir = __dirname + '/../run';
var cacheFile = runDir + '/contacts.json';

var Config = require(__dirname + '/config');
var config = new Config();

function writeToCache(contacts) {
    fs.writeFileSync(cacheFile, JSON.stringify(contacts,null));
}

function readFromCache() {
    var rawJson = fs.readFileSync(cacheFile);
    return JSON.parse(rawJson);
}

function updatePractitionerInHwr(contact, responseContact) {
    return Practitioner.createRapidProIdInHwr(contact.fields.globalid, responseContact.uuid);
}

function postContactToRapidPro(rapidProContactEndPoint, contact, logFile) {

    function logFailure(body) {
        process.stdout.write('E');
        logFile.write('============\n'
            + '--> pushing data\n'
            + JSON.stringify(contact) + '\n'
            + '<-- getting response\n'
            + body + '\n' );
    }

    
    try {	    
	var response = syncrequest(
	    'POST',
	    rapidProContactEndPoint,
	    {
		headers: {
		    'content-type': 'application/json',
		    Authorization: 'Token ' + config.authentication.rapidpro.token
		},
		body: JSON.stringify(contact)
	    }
	);
	var body = response.getBody();
        var responseContact = JSON.parse(body);
        if (responseContact.uuid) {
            if(contact.uuid) {
                process.stdout.write('.');
            } else {
                updatePractitionerInHwr(contact, responseContact).then(function () {
                    process.stdout.write('.');
                });
            }
        } else {
            logFailure(body);
	    return false;
        }
    } catch (error) {
        logFailure(body);
	return false;
    }
    return true;
}

var Hero = function () {
    this.pull = function () {
        var practitionerEndPoint = config.practitionerEndPoint;
        var locationEndPoint = config.locationEndPoint;
        var organisationEndPoint = config.organisationEndPoint;

        // FIXME: better to use Q.all here
        return Practitioner.loadAll(practitionerEndPoint).then(function (allPractitioners) {
            return Location.loadAll(locationEndPoint).then(function (allLocations) {
                return Organisation.loadAll(organisationEndPoint).then(function (allOrganisations) {
                    var mergedPractitioners = Practitioner.merge(allPractitioners, allLocations, allOrganisations);
                    console.log(mergedPractitioners.length.toString() + ' practitioners downloaded from HWR');
                    return Practitioner.formatForRapidPro(mergedPractitioners).then(function (allContacts) {
                        writeToCache(allContacts);
                        console.log(allContacts.length.toString() + ' contacts put into cache');
                    });
                });
            });
        });
    };

    this.push = function () {
        var rapidProContactEndPoint = config.rapidProAPIEndPoint + "/contacts.json";
        var allContacts = readFromCache();

        var logFile = fs.createWriteStream(runDir + '/push.log', {flags: 'w'});

        var contactsWithPhoneNumber = allContacts.filter(function (contact) {
            return contact.phone;
        });

        console.log('Now, doing a sync. push of ' + contactsWithPhoneNumber.length + ' contacts to RapidPro.');
	var len = contactsWithPhoneNumber.length;
	for (var i = 0; i < len; i++) {
            if ( postContactToRapidPro(rapidProContactEndPoint, contactsWithPhoneNumber[i], logFile)) {
                process.stdout.write('.');
	    }
	}
    };
};

module.exports = Hero;