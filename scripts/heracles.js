#!/usr/bin/env node

var Hero = require(__dirname + '/../app/hero');

var practitionerEndPoint = 'http://liberia-staging.mhero.org:8984/CSD/csr/merged_sierra_leone/careServicesRequest/urn:openhie.org:openinfoman-fhir:fhir_practitioner_read/adapter/fhir/Practitioner/_search?_format=json&name.text=&organization.reference=&location.reference=';
var locationEndPoint = 'http://liberia-staging.mhero.org:8984/CSD/csr/merged_sierra_leone/careServicesRequest/urn:openhie.org:openinfoman-fhir:fhir_location_read/adapter/fhir/Location/_search?_format=json&name=&managingOrganization.reference=';
var organisationEndPoint = 'http://liberia-staging.mhero.org:8984/CSD/csr/merged_sierra_leone/careServicesRequest/urn:openhie.org:openinfoman-fhir:fhir_organization_read/adapter/fhir/Organization/_search?_format=json&name=&partOf.reference=';

var hero = new Hero({
    practitionerEndPoint: practitionerEndPoint,
    locationEndPoint: locationEndPoint,
    organisationEndPoint: organisationEndPoint
});

hero.pull().then(function() {
    console.log('DONE');
});
