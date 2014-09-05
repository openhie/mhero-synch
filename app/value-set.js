var ValueSet = function (concepts) {
    this.get = function (code) {
        if(!concepts) {
            return null;
        }

        return concepts.filter(function (concept) {
            return concept.code == code;
        })[0];
    };
};

ValueSet.load = function (endPoint, codingSystem) {
    var Q = require('q');
    var deferred = Q.defer();

    // FIXME: should refactor this network request to feed-reader
    var request = require('request');
    request(endPoint + '?ID=' + codingSystem, function (error, response, body) {
        if (error) {
            // FIXME: should be reject instead of resolve an exceptional value
            deferred.resolve(new ValueSet());
            return;
        }

        if (response.statusCode != 200) {
            // FIXME: should be reject instead of resolve an exceptional value
            deferred.resolve(new ValueSet());
            return;
        }

        var parseString = require('xml2js').parseString;
        parseString(body, function (err, result) {
            var rawValueSet = result['svs:RetrieveValueSetResponse']['svs:ValueSet'];
            if(!rawValueSet) {
                // FIXME: should be reject instead of resolve an exceptional value
                deferred.resolve(new ValueSet());
                return;
            }

            var rawConcepts = rawValueSet[0]['svs:ConceptList'][0]['svs:Concept'];
            var allConcepts = rawConcepts.map(function (rawConcept) {
                return rawConcept['$'];
            });
            deferred.resolve(new ValueSet(allConcepts));
        });
    });

    return deferred.promise;
};

module.exports = ValueSet;