var Practitioner = function (item) {
    var jsonContent = JSON.parse(item['atom:content']['#']);
    this.globalId = jsonContent.identifier[0].value;
    this.familyName = jsonContent.name.family[0];
    this.givenName = jsonContent.name.given[0];
    this.email = getContact(jsonContent, 'EMAIL');
    this.phone = getContact(jsonContent, 'BP');

    function getContact(jsonContent, contactField) {
        var contact = jsonContent.telecom;
        if(contact.length == 0) {
            return null;
        }

        var specifiedContact = contact.filter(function (aContact) {
            return aContact.system == contactField;
        })[0];
        return specifiedContact == undefined ? null : specifiedContact.value.trim();
    }
};

Practitioner.loadAll = function (url) {
    var FeedReader = require(__dirname + '/feed-reader');
    var feedReader = new FeedReader(Practitioner, url);
    return feedReader.loadAll();
};

module.exports = Practitioner;
