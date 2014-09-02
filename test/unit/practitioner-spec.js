var Practitioner = require(__dirname + '/../../app/practitioner');

describe('Practitioner', function () {
    var Fixtures = require(__dirname + '/../fixtures/fixtures');

    describe('loadAll', function () {
        it('loads all practitioners from a remote end point', function (done) {
            var endPointUrl = 'http://liberia-staging.mhero.org:8984/CSD/csr/merged_sierra_leone/careServicesRequest/urn:openhie.org:openinfoman-fhir:fhir_practitioner_read/adapter/fhir/Practitioner/_history?_format=json&_since=1900-01-01'
            Practitioner.loadAll(endPointUrl).then(function (allPractitioners) {
                expect(allPractitioners.length).toBe(1038);

                var firstPractitioner = allPractitioners[0];
                expect(firstPractitioner.globalId).toBe('urn:ihris.org:manage-demo:csd:provider:person|10004');
                expect(firstPractitioner.parentId).toBe('urn:dhis.org:sierra-leone-demo:csd:facility:dCvUVvKnhMe');
                expect(firstPractitioner.givenName).toBe('Traifrop');
                expect(firstPractitioner.familyName).toBe('mr bill');
                expect(firstPractitioner.email).toBe(null);
                expect(firstPractitioner.phone).toBe(null);

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
            expect(allLocations[0].fullName()).toBe('York CHC-Sittia-Sierra Leone')
        });
    });

    describe('formatForRapidPro', function () {
        it('formats all practitioners data into the format accepted by rapidpro', function () {
            var allPractitioners = Fixtures.practitioners();
            var allLocations = Fixtures.locations();
            var allOrganisations = Fixtures.organisations();

            var mergedPractitioners = Practitioner.merge(allPractitioners, allLocations, allOrganisations);
            var rapidProContacts = Practitioner.formatForRapidPro(mergedPractitioners);

            expect(rapidProContacts.length).toBe(3);
            var firstRapidProContact = rapidProContacts[0];
            //WIP: Foregoing ommiting contacts without phone numbers till we get the correct data
            expect(firstRapidProContact.phone).toBe(null);
            expect(firstRapidProContact.name).toBe('mr bill Traifrop');
            expect(firstRapidProContact.groups[0]).toBe('York CHC-Sittia-Sierra Leone');
        });
    });
});
