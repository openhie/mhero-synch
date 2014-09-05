var Practitioner = require(__dirname + '/../../app/practitioner');
var Config = require(__dirname + '/../../app/config');
var config = new Config('dev');

describe('Practitioner', function () {
    var Fixtures = require(__dirname + '/../fixtures/fixtures');

    describe('loadAll', function () {
        it('loads all practitioners from a remote end point', function (done) {
            var endPointUrl = config.practitionerEndPoint;
            Practitioner.loadAll(endPointUrl).then(function (allPractitioners) {
                expect(allPractitioners.length).toBe(38);

                var firstPractitioner = allPractitioners[0];
                expect(firstPractitioner.globalId).toBe('urn:ihris.org:manage-demo:csd:provider:person|9924');
                expect(firstPractitioner.parentId).toBe('urn:dhis.org:sierra-leone-demo:csd:facility:Bift1B4gjru');
                expect(firstPractitioner.givenName).toBe('Tiastejoclou');
                expect(firstPractitioner.familyName).toBe('Dem');
                expect(firstPractitioner.email).toBe(null);
                expect(firstPractitioner.phone).toBe(null);
                expect(firstPractitioner.role.length).toBe(1);
                expect(firstPractitioner.role[0].coding[0].code).toBe('MD');

                var lastPractitioner = allPractitioners[allPractitioners.length - 1];
                expect(lastPractitioner.globalId).toBe('urn:dhis.org:sierra-leone-demo:csd:provider:o3wC90im0LD');
                expect(lastPractitioner.phone).toBe('12456789');

                done();
            }).catch(function (error) {
                expect(error).toBe(null);
                done();
            });
        });
    });

    describe('merge', function () {
        it('merges all practitioners, locations and organisations in a hierarchy', function () {
            var allPractitioners = Fixtures.practitioners();
            var allLocations = Fixtures.locations();
            var allOrganisations = Fixtures.organisations();

            var mergedPractitioners = Practitioner.merge(allPractitioners, allLocations, allOrganisations);

            expect(mergedPractitioners.length).toBe(3);
            expect(mergedPractitioners[0].parent.globalId).toBe('location_1');
            expect(mergedPractitioners[0].parent.parent.globalId).toBe('organisation_1');
            expect(allLocations[0].fullName()).toBe('Sierra Leone, Sittia, York CHC')
        });
    });

    describe('cadres', function () {
        it('returns all cadres based on roles', function (done) {
            var allPractitioners = Fixtures.practitioners();
            var practitioner = allPractitioners[0];
            practitioner.role = [
                {
                    "coding": [
                        { "system": "urn:oid:2.25.268234768686152474523705575269868869248.2", "code": "sVu7XCJUKNu" }
                    ]
                }
            ];

            practitioner.cadres().then(function (cadres) {
                expect(cadres.length).toBe(1);
                expect(cadres[0]).toBe('Ebola Data entry');
                done();
            }).catch(function (error) {
                expect(error).toBe(null);
            });
        });
    });

    describe('formatForRapidPro', function () {
        var allPractitioners = Fixtures.practitioners();
        var allLocations = Fixtures.locations();
        var allOrganisations = Fixtures.organisations();
        var mergedPractitioners = Practitioner.merge(allPractitioners, allLocations, allOrganisations);

        it('formats all practitioners data into the format accepted by rapidpro', function (done) {
            Practitioner.formatForRapidPro(mergedPractitioners).then(function (rapidProContacts) {
                expect(rapidProContacts.length).toBe(3);
                var firstRapidProContact = rapidProContacts[0];
                expect(firstRapidProContact.fields.globalId).toBe('practitioner_1');
                expect(firstRapidProContact.phone).toBe('+231777926824');
                expect(firstRapidProContact.name).toBe('mr bill Traifrop');
                expect(firstRapidProContact.groups.length).toBe(4);
                expect(firstRapidProContact.groups[0]).toBe('Sierra Leone, Sittia, York CHC');
                expect(firstRapidProContact.groups[1]).toBe('Sierra Leone, Sittia');
                expect(firstRapidProContact.groups[2]).toBe('Sierra Leone');
                expect(firstRapidProContact.groups[3]).toBe('Ebola Data entry');

                done();
            });
        });

        it('replaces leading double zeros to plus sign', function (done) {
            var practitioner = allPractitioners[0];
            practitioner.phone = '00231-888-097-810';

            practitioner.toRapidProContact().then(function (contact) {
                expect(contact.phone).toBe('+231888097810');
                done();
            });

        });

        it('cuts off phone numbers after slash', function (done) {
            var practitioner = allPractitioners[0];
            practitioner.phone = '+231-773-219-26 / 880-609-979';

            practitioner.toRapidProContact().then(function (contact) {
                expect(contact.phone).toBe('+23177321926');
                done();
            });

        });

        it('clears unnecessary characters in phone numbers', function (done) {
            var practitioner = allPractitioners[0];
            practitioner.phone = '(+231) 0886-609-940 ,';

            practitioner.toRapidProContact().then(function (contact) {
                expect(contact.phone).toBe('+2310886609940');
                done();
            });

        });

        it('fills cadres into contact', function (done) {
            var practitioner = allPractitioners[0];

            practitioner.toRapidProContact().then(function(contact) {
                expect(contact.cadres).toEqual(['Ebola Data entry']);
                done();
            });
        });

        it('does not fill cadre if code system does not exist', function(done) {
            var practitioner = allPractitioners[0];
            practitioner.role = [
                {
                    "coding": [
                        { "system": "urn:oid:2.25.11111176868615247452370557526986886924", "code": "MD" }
                    ]
                }
            ];

            practitioner.toRapidProContact().then(function(contact) {
                expect(contact.cadres).toEqual([]);
                done();
            });
        });
    });
});
