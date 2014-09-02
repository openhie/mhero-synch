var Practitioner = require(__dirname + '/../../app/practitioner');

describe('Practitioner', function () {
    describe('loadAll', function () {
        it('loads all practitioners from a remote end point', function (done) {
            var endPointUrl = 'http://liberia-staging.mhero.org:8984/CSD/csr/merged_sierra_leone/careServicesRequest/urn:openhie.org:openinfoman-fhir:fhir_practitioner_read/adapter/fhir/Practitioner/_search?_format=json&name.text=&organization.reference=&location.reference='
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
                    parentId: 'organisation_1',
                    name: 'Loc1'
                },
                {
                    globalId: 'location_2',
                    parentId: 'organisation_1',
                    name: 'Loc2'
                }
            ];

            var allOrganisations = [
                {
                    globalId: 'organisation_1',
                    name: 'Org1'
                }
            ];

            var mergedPractitioners = Practitioner.merge(allPractitioners, allLocations, allOrganisations);

            expect(mergedPractitioners.length).toBe(3);
            expect(mergedPractitioners[0].parent.globalId).toBe('location_1');
            expect(mergedPractitioners[0].parent.parent.globalId).toBe('organisation_1');
        });
    });
});