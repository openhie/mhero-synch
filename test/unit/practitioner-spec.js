var Practitioner = require(__dirname + '/../../app/practitioner');

describe('Practitioner', function () {
    describe('loadAll', function () {
        it('loads all practitioners from a remote end point', function (done) {
            var endPointUrl = 'http://liberia-staging.mhero.org:8984/CSD/csr/dhis2_training_liberia/careServicesRequest/urn:openhie.org:openinfoman-fhir:fhir_practitioner_read/adapter/fhir/Practitioner/_search?name.text=&_format=json&organization.reference=&location.reference='
            Practitioner.loadAll(endPointUrl).then(function (allPractitioners) {
                expect(allPractitioners.length).toBe(200);

                var firstPractitioner = allPractitioners[0];
                expect(firstPractitioner.globalId).toBe('urn:dhis.org:liberia-training:csd:provider:dbQGGwj9Dke');
                expect(firstPractitioner.parentId).toBe('urn:dhis.org:liberia-training:csd:organization:LHNiyIWuLdc');
                expect(firstPractitioner.givenName).toBe('Jallah');
                expect(firstPractitioner.familyName).toBe('Kennedy');
                expect(firstPractitioner.email).toBe('jallahmk@hotmail.com');
                expect(firstPractitioner.phone).toBe(null);

                var fifthPractitioner = allPractitioners[4];
                expect(fifthPractitioner.phone).toBe('236847915');

                done();
            });
        });
    });

    describe('merge', function () {
        it('merges all practitioners, locations and organisations in a hierarchy', function () {
            var allPractitioners = [
                {
                    globalId: 'practitioner_1',
                    parentId: 'location_1'
                },
                {
                    globalId: 'practitioner_2',
                    parentId: 'location_1'
                },
                {
                    globalId: 'practitioner_3',
                    parentId: 'location_2'
                }
            ];

            var allLocations = [
                {
                    globalId: 'location_1',
                    parentId: 'organisation_1'
                },
                {
                    globalId: 'location_2',
                    parentId: 'organisation_1'
                }
            ];

            var allOrganisations = [
                {
                    globalId: 'organisation_1'
                }
            ];

            var mergedPractitioners = Practitioner.merge(allPractitioners, allLocations, allOrganisations);
            expect(mergedPractitioners.length).toBe(3);
            expect(mergedPractitioners[0].parent.globalId).toBe('location_1');
            expect(mergedPractitioners[0].parent.parent.globalId).toBe('organisation_1');
        });
    });
});