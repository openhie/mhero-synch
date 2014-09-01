var Q = require('q');

var Practitioner = function (item) {
    var jsonContent = JSON.parse(item['atom:content']['#']);
    this.globalId = jsonContent.identifier[0].value;
    this.familyName = jsonContent.name.family[0];
    this.givenName = jsonContent.name.given[0];
    this.email = getEmail(jsonContent);

    function getEmail(jsonContent) {
        var contact = jsonContent.contact;
        if(contact.length == 0) {
            return null;
        }
        return contact[0].value;
    }
};

Practitioner.load_all = function () {
    var deferred = Q.defer();

    var request = require('request'),
        FeedParser = require('feedparser');


    var req = request('http://liberia-staging.mhero.org:8984/CSD/csr/dhis2_training_liberia/careServicesRequest/urn:openhie.org:openinfoman-fhir:fhir_practitioner_read/adapter/fhir/Practitioner/_search?name.text=&_format=json&organization.reference=&location.reference=');
    var feedParser = new FeedParser([]);

    req.on('error', function (error) {
        throw error;
    });
    req.on('response', function (res) {
        if (res.statusCode != 200) {
            return this.emit('error', new Error('Bad status code'));
        }
        this.pipe(feedParser);
    });

    var allPractitioners = [];

    feedParser.on('error', function (error) {
        throw error;
    });

    feedParser.on('readable', function () {
        var item;
        while (item = this.read()) {
            allPractitioners.push(new Practitioner(item));
        }
    });

    feedParser.on('end', function () {
        deferred.resolve(allPractitioners);
    });

    return deferred.promise;
};

module.exports = Practitioner;
